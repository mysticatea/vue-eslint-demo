<template>
    <li class="configuration-category__root">
        <!-- Header -->
        <category-header
            v-model="opened"
            :text="header"
            :peek-text="headerPeek"
        />
        <!-- Body -->
        <ul v-if="opened" class="configuration-category__body">
            <category-item
                v-if="multi && items.length >= 2"
                key="LUMP"
                :checked="allItemsAreChecked"
                :text="lumpText"
                @change="onLumpChange"
            />
            <category-item
                v-for="item of items"
                :key="item.id"
                :checked="item.checked"
                :description="item.description"
                :link="item.url"
                :text="item.name"
                :type="selectType"
                @change="onItemChange($event, item.id)"
            />
        </ul>
    </li>
</template>

<script>
import CategoryHeader from "./configuration-category-header.vue"
import CategoryItem from "./configuration-category-item.vue"

export default {
    name: "ConfigurationCategory",

    components: {
        CategoryHeader,
        CategoryItem,
    },

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
        lumpText: {
            type: String,
            default: "(all items)",
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

    methods: {
        onItemChange(selected, id) {
            this.$emit("select", { id, selected })
        },

        onLumpChange(selected) {
            this.$emit("bulkselect", { selected })
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

.configuration-category__body {
    list-style: none;
    margin: 0;
    padding: 0;
    background-color: white;
}
</style>
