<template>
    <li class="rule-select-category__root">
        <label class="rule-select-category__header">
            <input
                type="checkbox"
                v-model="shown"
                style="display:none"
            >
            <md-icon :kind="shown ? 'expand_more' : 'chevron_right'"/>
            {{ category.name }}
            <span class="rule-select-category__count">
                ({{ countChecked }} / {{ countAll }})
            </span>
        </label>
        <ul
            class="rule-select-category__rules"
            v-if="shown"
        >
            <li>
                <label class="rule-select-category__rule">
                    <input
                        type="checkbox"
                        v-model="allRules"
                        :true-value="2"
                        :false-value="0"
                        @change="emitChangeEvent"
                    >
                    (all rules)
                </label>
            </li>
            <li
                v-for="rule of category.rules"
                :key="rule.name"
                :title="rule.description"
            >
                <label class="rule-select-category__rule">
                    <input
                        type="checkbox"
                        v-model="config.rules[rule.name]"
                        :true-value="2"
                        :false-value="0"
                        @change="emitChangeEvent"
                    >
                    {{ stripPrefix(rule.name) }}
                </label>
            </li>
        </ul>
    </li>
</template>

<script>
import MdIcon from "./md-icon.vue"

export default {
    name: "RuleSelectCategory",

    components: { MdIcon },

    props: {
        category: {
            type: Object,
            default() {
                return { name: "", rules: [] }
            },
        },
        config: {
            type: Object,
            default() {
                return { rules: {} }
            },
        },
    },

    data() {
        return { shown: false }
    },

    computed: {
        allRules: {
            get() {
                const checked = this.category.rules.every(rule => this.config.rules[rule.name] === 2)
                return checked ? 2 : 0
            },
            set(value) {
                for (const rule of this.category.rules) {
                    this.config.rules[rule.name] = value
                }
            },
        },

        countChecked() {
            return this.category.rules.filter(rule => this.config.rules[rule.name] === 2).length
        },

        countAll() {
            return this.category.rules.length
        },
    },

    methods: {
        stripPrefix(ruleId) {
            return ruleId.replace("vue/", "")
        },

        emitChangeEvent() {
            this.$emit("change")
        },
    },
}
</script>

<style>
.rule-select-category__root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.rule-select-category__header {
    display: block;
    padding: 8px;
    background-color: #E8F5E9;
    border-bottom: 1px solid #4CAF50;
    font-weight: bold;
    cursor: pointer;
}
.rule-select-category__count {
    white-space: nowrap;
    font-weight: normal;
    color: gray;
}

.rule-select-category__rules {
    list-style: none;
    margin: 0;
    padding: 0;
    background-color: white;
}

.rule-select-category__rule {
    display: block;
    padding: 4px;
    padding-left: 16px;
    border-bottom: 1px solid #E8F5E9;
}
li:last-child > .rule-select-category__rule {
    border-bottom: 1px solid #4CAF50;
}

.rule-select-category__rule > input[type=checkbox] {
    vertical-align: middle;
}

.rule-select-category__header:hover,
.rule-select-category__rule:hover {
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.065), rgba(0,0,0,0.0325) 67%, rgba(0,0,0,0.065));
}
</style>
