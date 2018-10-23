<template>
    <label class="configuration-category-header">
        <input
            type="checkbox"
            style="display:none"
            :checked="opened"
            @change="onChange"
        >
        <md-icon :kind="iconKind" />
        {{ text }}
        <span v-if="peekText" class="configuration-category-header__peek">
            {{ peekText }}
        </span>
    </label>
</template>

<script>
import MdIcon from "./md-icon.vue"

export default {
    name: "ConfigurationCategoryHeader",

    components: { MdIcon },

    model: {
        prop: "opened",
        event: "open",
    },

    props: {
        opened: {
            type: Boolean,
            default: false,
        },
        peekText: {
            type: String,
            default: "",
        },
        text: {
            type: String,
            default: "",
        },
    },

    computed: {
        iconKind() {
            return this.opened ? "expand_more" : "chevron_right"
        },
    },

    methods: {
        onChange(event) {
            const opened = event.target.checked
            this.$emit("open", opened)
        },
    },
}
</script>

<style>
.configuration-category-header {
    display: block;
    position: sticky;
    top: 0;
    padding: 8px;
    background-color: #e8f5e9;
    border-bottom: 1px solid #4caf50;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.25);
}
.configuration-category-header:hover {
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.065),
        rgba(0, 0, 0, 0.0325) 67%,
        rgba(0, 0, 0, 0.065)
    );
}

.configuration-category-header__peek {
    white-space: nowrap;
    font-weight: normal;
    color: gray;
}
</style>
