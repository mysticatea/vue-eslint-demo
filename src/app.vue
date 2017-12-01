<template>
    <div class="app__root">
        <div class="app__header">
            <label class="app__show-fixed-code-button">
                <input
                    type="checkbox"
                    v-model="showFixedCode"
                >
                Show fixed code
            </label>
            Playground for <a href="https://github.com/vuejs/eslint-plugin-vue#readme" target="_blank">eslint-plugin-vue</a>.
        </div>
        <div class="app__body">
            <rule-select
                class="app__sidebar"
                :config="config"
                @change="onConfigChange"
            />
            <div class="app__main">
                <code-editor
                    class="app__editor"
                    :code="code"
                    :messages="messages"
                    :fixed-code="fixedCode"
                    :fixed-messages="fixedMessages"
                    :show-fixed-code="showFixedCode"
                    @edit="onEdit"
                    @initialize.once="onEditorInitialize"
                />
                <message-list class="app__errors" :messages="messages" />
            </div>
        </div>
        <div class="app__footer">
            <div class="app__footer-message"/>
            <div
                class="app__version-item"
                v-for="(v, name) in versions"
                :key="name"
            >
                <a :href="'https://github.com/' + v.repo" target="_blank">{{ name }}</a>
                v{{ v.version }}
            </div>
        </div>
    </div>
</template>

<script>
import CodeEditor from "./code-editor.vue"
import MessageList from "./message-list.vue"
import RuleSelect from "./rule-select.vue"
import { linter } from "./eslint.js"
import { deserializeState, serializeState } from "./state.js"
import versions from "./versions.js"

export default {
    name: "App",

    components: {
        CodeEditor,
        MessageList,
        RuleSelect,
    },

    data() {
        return deserializeState(window.location.hash.slice(1))
    },

    computed: {
        messages() {
            try {
                return linter.verify(this.code, this.config, "vue-eslint-demo.vue")
            }
            catch (err) {
                return [{
                    fatal: true,
                    severity: 2,
                    message: err.message,
                    line: 1,
                    column: 0,
                }]
            }
        },

        fixResult() {
            try {
                return linter.verifyAndFix(this.code, this.config, "vue-eslint-demo.vue")
            }
            catch (err) {
                return {
                    output: this.code,
                    messages: [{
                        fatal: true,
                        severity: 2,
                        message: err.message,
                        line: 1,
                        column: 0,
                    }],
                }
            }
        },

        fixedCode() {
            return this.fixResult.output
        },

        fixedMessages() {
            return this.fixResult.messages
        },

        versions() {
            return versions
        },
    },

    mounted() {
        window.addEventListener("hashchange", this.onUrlHashChange)
    },
    beforeDestroey() {
        window.removeEventListener("hashchange", this.onUrlHashChange)
    },

    methods: {
        onEdit(code) {
            this.code = code
            this.applyUrlHash()
        },

        onEditorInitialize() {
            window.MainContent.show()
        },

        onConfigChange() {
            this.applyUrlHash()
        },

        onUrlHashChange() {
            const newSerializedState = window.location.hash.slice(1)
            const oldSerializedState = serializeState(this.$data)
            if (newSerializedState !== oldSerializedState) {
                Object.assign(this.$data, deserializeState(newSerializedState))
            }
        },

        applyUrlHash() {
            window.location.hash = `#${serializeState(this.$data)}`
        },
    },
}
</script>

<style>
a {
    color: inherit;
}
a:hover {
    color: #2196F3;
}

.app__root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.app__header {
    flex-shrink: 0;
    padding: 8px;
    background-color: #A5D6A7;
    border-bottom: 1px solid #4CAF50;
    font-weight: bold;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.app__body {
    display: flex;
    flex-grow: 1;
    min-height: 0;
}

.app__sidebar {
    width: calc(25% - 1px);
    border-right: 1px solid #CCC;
}

.app__main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.app__editor {
    height: calc(75% - 1px);
    flex-grow: 1;
    border-bottom: 1px solid #CCC;
}

.app__errors {
    height: 25%;
}

.app__show-fixed-code-button {
    display: block;
    float: right;
    font-weight: normal;
}
.app__show-fixed-code-button > input[type=checkbox] {
    vertical-align: middle;
}

.app__footer {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    flex-shrink: 0;
    border-top: 1px solid #CCC;
}
.app__footer-message {
    flex-grow: 1;
    color: #B71C1C;
}
.app__version-item {
    flex-shrink: 0;
    margin-right: 8px;
}
.app__version-item:not(:last-child)::after {
    content: ","
}
</style>
