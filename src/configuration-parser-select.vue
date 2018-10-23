<template>
    <configuration-category
        header="Parser"
        :header-peek="'(' + currentParser + ')'"
        :items="parsers"
        @select="onItemSelect"
    />
</template>

<script>
import { selectParser } from "./actions"
import ConfigurationCategory from "./configuration-category.vue"

const PARSRES = Object.freeze([
    Object.freeze({
        id: "espree",
        name: "espree (the default parser)",
        url: "https://github.com/eslint/espree",
    }),
    Object.freeze({
        id: "babel-eslint",
        name: "babel-eslint",
        url: "https://github.com/babel/babel-eslint",
    }),
])

export default {
    name: "ConfigurationParserSelect",

    components: { ConfigurationCategory },

    inject: ["sendAction"],
    props: {
        config: {
            type: Object,
            default() {
                return {}
            },
        },
    },

    computed: {
        parsers() {
            const parser = this.currentParser
            return PARSRES.map(p => ({ ...p, checked: p.id === parser }))
        },

        currentParser() {
            return this.config.parserOptions.parser || "espree"
        },
    },

    methods: {
        onItemSelect({ id, selected }) {
            if (selected) {
                this.sendAction(selectParser, id)
            }
        },
    },
}
</script>
