<template>
    <ul class="configuration__root">
        <configuration-parser-select
            :config="config"
            @change="onChange"
        />
        <configuration-rules-select
            v-for="category of categories"
            v-if="category.rules.length >= 1"
            :key="category.name"
            :category="category"
            :config="config"
            @change="onChange"
        />
    </ul>
</template>

<script>
import ConfigurationParserSelect from "./configuration-parser-select.vue"
import ConfigurationRulesSelect from "./configuration-rules-select.vue"
import { ruleCategories } from "./app-state.js"

export default {
    name: "Configuration",

    components: { ConfigurationParserSelect, ConfigurationRulesSelect },

    props: {
        config: {
            type: Object,
            default() {
                return {
                    parserOptions: { parser: "espree" },
                    rules: {},
                }
            },
        },
    },

    computed: {
        categories() {
            return ruleCategories
        },
    },

    methods: {
        onChange() {
            this.$emit("change")
        },
    },
}
</script>

<style>
.configuration__root {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
