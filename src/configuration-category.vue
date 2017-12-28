<template>
    <li class="configuration-category__root">
        <!-- Header -->
        <label class="configuration-category__header">
            <input type="checkbox" v-model="opened" style="display:none">
            <md-icon :kind="opened ? 'expand_more' : 'chevron_right'"/>
            {{ header }}
            <span v-if="headerPeek" class="configuration-category__header-peek">
                {{ headerPeek }}
            </span>
        </label>
        <!-- Body -->
        <ul v-if="opened" class="configuration-category__body">
            <li v-if="multi && items.length >= 2">
                <label class="configuration-category__select-item">
                    <div class="configuration-category__select-item-check">
                        <input
                            type="checkbox"
                            :checked="allItemsAreChecked"
                            @change="$emit('change', null, !allItemsAreChecked)"
                        >
                    </div>
                    <div class="configuration-category__select-item-name">
                        (all rules)
                    </div>
                </label>
            </li>
            <li v-for="item of items" :key="item.id" :title="item.description">
                <label class="configuration-category__select-item">
                    <div class="configuration-category__select-item-check">
                        <input
                            :type="selectType"
                            :value="item.id"
                            :checked="item.checked"
                            @change="$emit('change', item.id, $event.target.checked)"
                        >
                    </div>
                    <div class="configuration-category__select-item-name">
                        {{ item.name }}
                    </div>
                    <a v-if="item.url" class="configuration-category__select-item-link" :href="item.url" target="_blank" rel="noopener">
                        <md-icon kind="launch"/>
                    </a>
                </label>
            </li>
        </ul>
    </li>
</template>

<script>
import MdIcon from "./md-icon.vue"

export default {
    name: "ConfigurationCategory",

    components: { MdIcon },

    props: {
        header: {
            type: String,
            default: "",
        },
        headerPeek: {
            type: String,
            default: "",
        },
        items: {
            type: Array,
            default() {
                return []
            },
        },
        multi: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return { opened: false }
    },

    computed: {
        selectType() {
            return this.multi ? "checkbox" : "radio"
        },

        allItemsAreChecked() {
            return this.items.every(item => item.checked)
        },
    },
}
</script>

<style>
.configuration-category__root {
    list-style: none;
    margin: 0;
    padding: 0;
}

.configuration-category__header {
    display: block;
    position: sticky;
    top: 0;
    padding: 8px;
    background-color: #E8F5E9;
    border-bottom: 1px solid #4CAF50;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 2px rgba(0,0,0, 0.25);
}
.configuration-category__header-peek {
    white-space: nowrap;
    font-weight: normal;
    color: gray;
}

.configuration-category__body {
    list-style: none;
    margin: 0;
    padding: 0;
    background-color: white;
}

.configuration-category__select-item {
    display: flex;
    align-items: center;
    padding: 4px;
    padding-left: 16px;
    border-bottom: 1px solid #E8F5E9;
}
li:last-child > .configuration-category__select-item {
    border-bottom: 1px solid #4CAF50;
}

.configuration-category__header:hover,
.configuration-category__select-item:hover {
    background-image: linear-gradient(to bottom, rgba(0,0,0,0.065), rgba(0,0,0,0.0325) 67%, rgba(0,0,0,0.065));
}

.configuration-category__select-item-check {
    flex-shrink: 0;
    padding-top: 4px; /* align to the rule name */
    padding-right: 4px;
}
.configuration-category__select-item-name {
    flex-grow: 1;
}
.configuration-category__select-item-link {
    display: block;
    flex-shrink: 0;
}
</style>
