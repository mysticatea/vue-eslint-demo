<template>
    <div class="playground__root">
        <eslint-editor
            class="playground__editor"
            :code="code"
            :config="actualConfig"
            :filename="filename"
            :format="formatOptions"
            :language="language"
            :linter="linter"
            fix
            @change="onChange"
        />
        <message-list
            class="playground__messages"
            :messages="messages"
        />
    </div>
</template>

<script>
import EslintEditor from "vue-eslint-editor"
import { clone } from "./lib/clone"
import { linter } from "./lib/eslint"
import { editCode } from "./actions"
import MessageList from "./message-list.vue"

export default {
    name: "Playground",
    components: {
        EslintEditor,
        MessageList,
    },

    inject: ["sendAction"],
    props: {
        code: {
            type: String,
            default: "",
        },
        config: {
            type: Object,
            default() {
                return {}
            },
        },
        indentSize: {
            type: Number,
            default: 4,
        },
        indentType: {
            type: String,
            default: "space",
        },
    },

    data() {
        return { messages: [] }
    },

    computed: {
        actualConfig() {
            // Adjust the indentation options to the editor settings.
            const config = clone(this.config)
            const indentType =
                this.indentType === "space" ? this.indentSize : "tab"

            for (const ruleId of [
                "indent",
                "vue/html-indent",
                "vue/script-indent",
            ]) {
                const severity = config.rules[ruleId]
                config.rules[ruleId] = [severity, indentType]
            }

            return config
        },

        filename() {
            return this.looksHtml ? "vue-eslint-demo.vue" : "vue-eslint-demo.js"
        },

        formatOptions() {
            return {
                insertSpaces: this.indentType === "space",
                tabSize: this.indentSize,
            }
        },

        language() {
            return this.looksHtml ? "html" : "javascript"
        },

        linter() {
            return linter
        },

        looksHtml() {
            return this.code.trim().startsWith("<")
        },
    },

    methods: {
        onChange({ code, messages }) {
            this.messages = messages
            this.sendAction(editCode, code)
        },
    },
}
</script>

<style>
.playground__root {
    display: flex;
    flex-direction: column;
}

.playground__editor {
    flex-grow: 1;
    border-bottom: 1px solid #ccc;
}

.playground__messages {
    flex-shrink: 0;
    height: 25%;
}
</style>
