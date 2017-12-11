<template>
    <ul class="rule-select__root">
        <rule-select-category
            v-for="category of categories"
            v-if="category.rules.length >= 1"
            :category="category"
            :config="config"
            :key="category.name"
            @change="emitChangeEvent"
        />
    </ul>
</template>

<script>
import RuleSelectCategory from "./rule-select-category.vue"
import { ruleCategories } from "./app-state.js"

export default {
    name: "RuleSelect",

    components: { RuleSelectCategory },

    props: {
        config: {
            type: Object,
            default() {
                return { rules: {} }
            },
        },
    },

    computed: {
        categories() {
            return ruleCategories
        },
    },

    methods: {
        emitChangeEvent() {
            this.$emit("change")
        },
    },
}
</script>

<style>
.rule-select__root {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
