<template>
    <configuration-category
        header="Parser"
        :header-peek="'('+config.parserOptions.parser+')'"
        :items="parsers"
        @change="onChange"
    />
</template>

<script>
import ConfigurationCategory from "./configuration-category.vue"

const PARSRES = [
    {
        id: "espree",
        name: "espree (the default parser)",
        url: "https://github.com/eslint/espree",
    },
    {
        id: "babel-eslint",
        name: "babel-eslint",
        url: "https://github.com/babel/babel-eslint",
    },
]

export default {
    name: "ConfigurationParserSelect",

    components: { ConfigurationCategory },

    props: {
        config: {
            type: Object,
            default() {
                return { parserOptions: { parser: "espree" } }
            },
        },
    },

    computed: {
        parsers() {
            const parser = this.config.parserOptions.parser
            return PARSRES.map(p =>
                Object.assign({ checked: p.id === parser }, p)
            )
        },
    },

    methods: {
        onChange(id, checked) {
            if (checked) {
                this.config.parserOptions.parser = id
                this.$emit("change")
            }
        },
    },
}
</script>
