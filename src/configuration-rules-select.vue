<template>
    <configuration-category
        lump-text="(all rules)"
        multi
        :header="category.name"
        :header-peek="counterText"
        :items="rules"
        @select="onItemSelect"
        @bulkselect="onBulkSelect"
    />
</template>

<script>
import { selectRuleSeverity } from "./actions"
import ConfigurationCategory from "./configuration-category.vue"

export default {
    name: "ConfigurationRulesSelect",

    components: { ConfigurationCategory },

    inject: ["sendAction"],
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
            return this.category.rules.map(rule => ({
                ...rule,
                id: rule.name,
                checked: severityMap[rule.name] === 2,
            }))
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
        onBulkSelect({ selected }) {
            const ids = this.rules.map(rule => rule.id)
            const severity = selected ? 2 : 0
            this.sendAction(selectRuleSeverity, ids, severity)
        },

        onItemSelect({ id, selected }) {
            const severity = selected ? 2 : 0
            this.sendAction(selectRuleSeverity, id, severity)
        },
    },
}
</script>
