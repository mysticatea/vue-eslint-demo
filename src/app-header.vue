<template>
    <div class="app-header">
        <div class="app-header__title">
            Playground for <a href="https://github.com/vuejs/eslint-plugin-vue#readme" target="_blank" rel="noopener">
                eslint-plugin-vue
            </a>.
        </div>
        <label class="app-header__option-item">
            <select :value="indentSize" @change="onIndentSizeChange">
                <option value="2">
                    TabSize: 2
                </option>
                <option value="4">
                    TabSize: 4
                </option>
                <option value="8">
                    TabSize: 8
                </option>
            </select>
        </label>
        <label class="app-header__option-item">
            <select :value="indentType" @change="onIndentTypeChange">
                <option value="space">
                    Indent: spaces
                </option>
                <option value="tab">
                    Indent: tabs
                </option>
            </select>
        </label>
    </div>
</template>

<script>
import { selectIndentSize, selectIndentType } from "./actions"

export default {
    name: "AppHeader",

    inject: {
        sendAction: {
            default() {
                return () => {
                    // Do nothing.
                }
            },
        },
    },
    props: {
        indentSize: {
            type: Number,
            default: 4,
        },
        indentType: {
            type: String,
            default: "space",
        },
    },

    methods: {
        onIndentTypeChange(event) {
            const indentType = event.target.value
            if (indentType === "space" || indentType === "tab") {
                this.sendAction(selectIndentType, indentType)
            }
        },

        onIndentSizeChange(event) {
            const indentSize = Number(event.target.value)
            if (indentSize === 2 || indentSize === 4 || indentSize === 8) {
                this.sendAction(selectIndentSize, indentSize)
            }
        },
    },
}
</script>

<style>
.app-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    background-color: #a5d6a7;
    border-bottom: 1px solid #4caf50;
}
.app-header__title {
    flex-grow: 1;
    padding: 8px;
    font-weight: bold;
}
.app-header__option-item {
    flex-shrink: 0;
    padding: 2px;
}
.app-header__option-item > select {
    padding: 4px;
    border: 1px solid #4caf50;
    border-radius: 3px;
    background-color: #e8f5e9;
}
</style>
