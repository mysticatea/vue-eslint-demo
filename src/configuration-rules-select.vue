<template>
    <configuration-category
        multi
        :header="category.name"
        :header-peek="counterText"
        :items="rules"
        @change="onChange"
    />
</template>

<script>
import ConfigurationCategory from "./configuration-category.vue"

export default {
    name: "ConfigurationRulesSelect",

    components: { ConfigurationCategory },

    props: {
        config: {
            type: Object,
            default() {
                return { rules: {} }
            },
        },
        category: {
            type: Object,
            default() {
                return { name: "", rules: [] }
            },
        },
    },

    computed: {
        rules() {
            const severityMap = this.config.rules
            return this.category.rules.map(rule =>
                Object.assign(
                    { id: rule.name, checked: severityMap[rule.name] === 2 },
                    rule
                )
            )
        },

        countChecked() {
            const severityMap = this.config.rules
            let count = 0
            for (const rule of this.category.rules) {
                if (severityMap[rule.name] === 2) {
                    count += 1
                }
            }
            return count
        },

        countAll() {
            return this.category.rules.length
        },

        counterText() {
            return `(${this.countChecked}/${this.countAll})`
        },
    },

    methods: {
        onChange(id, checked) {
            const severityMap = this.config.rules
            if (id == null) {
                for (const rule of this.rules) {
                    severityMap[rule.name] = (checked ? 2 : 0)
                }
            }
            else {
                severityMap[id] = (checked ? 2 : 0)
            }
            this.$emit("change")
        },
    },
}
</script>
