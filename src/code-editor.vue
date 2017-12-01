<template>
    <div class="code-editor-container"/>
</template>

<script>
import debounce from "lodash/debounce"

/*globals monaco */

const EDITOR_OPTS = {
    autoIndent: true,
    automaticLayout: true,
    find: {
        autoFindInSelection: true,
        seedSearchStringFromSelection: true,
    },
    formatOnPaste: true,
    renderControlCharacters: true,
    renderIndentGuides: true,
    renderWhitespace: "boundary",
    scrollBeyondLastLine: false,
}

// Load the loader.
const ready = new Promise((resolve, reject) => {
    /** @returns {void} */
    function onLoaderReady() {
        window.require(["vs/editor/editor.main"], resolve)
    }

    if (window.require !== undefined) {
        onLoaderReady()
        return
    }

    const script = document.createElement("script")
    script.async = true
    script.src = "vs/loader.js"
    script.onload = onLoaderReady
    script.onerror = reject
    document.head.appendChild(script)
})

/**
 * Ensure that a given value is a positive value.
 * @param {number|undefined} value The value to check.
 * @param {number} defaultValue The default value which is used if the `value` is undefined.
 * @returns {number} The positive value as the result.
 */
function ensurePositiveInt(value, defaultValue) {
    return Math.max(1, (value !== undefined ? value : defaultValue) | 0)
}

/**
 * Convert a message of ESLint to a marker of MonacoEditor.
 * @param {ESLintMessage} message The message to convert.
 * @returns {monaco.editor.IMarkerData} The marker data.
 */
function messageToMarker(message) {
    const startLineNumber = ensurePositiveInt(message.line, 1)
    const startColumn = ensurePositiveInt(message.column, 1)
    const endLineNumber = ensurePositiveInt(message.endLine, startLineNumber)
    const endColumn = ensurePositiveInt(message.endColumn, startColumn + 1)

    return {
        severity: monaco.Severity.Error,
        source: "ESLint",
        message: `${message.message} (${message.ruleId || "FATAL"})`,
        startLineNumber,
        startColumn,
        endLineNumber,
        endColumn,
    }
}

/**
 * Update the markers of a given editor.
 * @param {monaco.editor.IStandaloneEditor} editor The editor to update.
 * @param {ESLintMessage[]} messages The messages of new markers.
 * @returns {void}
 */
function updateMarkers(editor, messages) {
    const model = editor.getModel()
    const id = editor.getId()
    const markers = messages.map(messageToMarker)

    monaco.editor.setModelMarkers(model, id, markers)
}

/**
 * Update the value of a given editor.
 * @param {monaco.editor.IStandaloneEditor} editor The editor to update.
 * @param {string} value The new value.
 * @returns {void}
 */
function updateValue(editor, value) {
    const model = editor.getModel()
    if (model != null && value !== model.getValue()) {
        model.setValue(value)
    }
}

/**
 * Dispose.
 * @param {any} x The target object.
 * @returns {void}
 */
function dispose(x) {
    if (x == null) {
        return
    }

    if (x.dispose) {
        x.dispose()
    }
    if (x.getOriginalEditor) {
        dispose(x.getOriginalEditor())
    }
    if (x.getModifiedEditor) {
        dispose(x.getModifiedEditor())
    }
    if (x.getModel) {
        dispose(x.getModel())
    }
}

export default {
    name: "CodeEditor",

    props: {
        code: {
            type: String,
            default: "",
        },
        fixedCode: {
            type: String,
            default: "",
        },
        messages: {
            type: Array,
            default() {
                return []
            },
        },
        fixedMessages: {
            type: Array,
            default() {
                return []
            },
        },
        showFixedCode: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            editor: null,
            ready: ready.then(this.initialize),
            invalidate: debounce(() => {
                const editor = this.codeEditor
                if (editor != null) {
                    const model = editor.getModel()
                    const value = model.getValue()
                    this.$emit("edit", value)
                }
            }, 667),
        }
    },

    computed: {
        codeEditor() {
            const editor = this.editor
            if (editor != null) {
                if (editor.getOriginalEditor != null) {
                    return editor.getOriginalEditor()
                }
                return editor
            }
            return null
        },

        fixedCodeEditor() {
            const editor = this.editor
            if (editor != null && editor.getModifiedEditor != null) {
                return editor.getModifiedEditor()
            }
            return editor
        },
    },

    watch: {
        code(value) {
            const editor = this.codeEditor
            if (editor != null) {
                updateValue(editor, value)
            }
        },

        fixedCode(value) {
            const editor = this.fixedCodeEditor
            if (editor != null) {
                updateValue(editor, value)
            }
        },

        messages(value) {
            const editor = this.codeEditor
            if (editor != null) {
                updateMarkers(editor, value)
            }
        },

        // But it's not shown.
        // See https://github.com/Microsoft/monaco-editor/issues/311
        fixedMessages(value) {
            const editor = this.fixedCodeEditor
            if (editor != null) {
                updateMarkers(editor, value)
            }
        },

        showFixedCode() {
            this.ready.then(this.initialize)
        },
    },

    beforeDestroy() {
        dispose(this.editor)
        this.$el.innerHTML = ""
        this.editor = null
    },

    methods: {
        initialize() {
            dispose(this.editor)
            this.$el.innerHTML = ""
            this.editor = this.showFixedCode ? this.createTwoPaneEditor() : this.createEditor()
            this.$emit("initialize")
        },

        createEditor() {
            const editor = monaco.editor.create(
                this.$el,
                Object.assign({ value: this.code, language: "html" }, EDITOR_OPTS)
            )

            // Set change event.
            editor.getModel().onDidChangeContent(() => {
                this.invalidate()
            })

            // Set markers.
            updateMarkers(editor, this.messages)

            return editor
        },

        createTwoPaneEditor() {
            // Initialize editors.
            const editor = monaco.editor.createDiffEditor(this.$el, EDITOR_OPTS)
            const original = monaco.editor.createModel(this.code, "html")
            const modified = monaco.editor.createModel(this.fixedCode, "html")
            const leftEditor = editor.getOriginalEditor()
            const rightEditor = editor.getModifiedEditor()

            // Set editable to the left area.
            // Set readonly to the right area.
            leftEditor.updateOptions({ readOnly: false })
            rightEditor.updateOptions({ readOnly: true })

            // Set change event.
            original.onDidChangeContent(() => {
                updateValue(rightEditor, original.getValue())
                this.invalidate()
            })

            // Set model.
            editor.setModel({ original, modified })

            // Set markers.
            updateMarkers(leftEditor, this.messages)
            updateMarkers(rightEditor, this.fixedMessages)

            return editor
        },
    },
}
</script>
