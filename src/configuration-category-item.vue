<template>
    <li class="configuration-category-item__root" :title="description">
        <label>
            <div class="configuration-category-item__check">
                <input :type="type" :checked="checked" @change="onChange">
            </div>
            <div class="configuration-category-item__name">
                {{ text }}
            </div>
            <a
                v-if="link"
                class="configuration-category-item__link"
                :href="link"
                target="_blank"
                rel="noopener"
            >
                <md-icon kind="launch" />
            </a>
        </label>
    </li>
</template>

<script>
import MdIcon from "./md-icon.vue"

export default {
    name: "ConfigurationCategoryItem",

    components: { MdIcon },

    props: {
        checked: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: "",
        },
        link: {
            type: String,
            default: "",
        },
        text: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            default: "checkbox",
            validator(value) {
                return value === "checkbox" || value === "radio"
            },
        },
    },

    methods: {
        onChange(event) {
            const checked = event.target.checked
            this.$emit("change", checked)
        },
    },
}
</script>

<style>
.configuration-category-item__root > label {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px;
    padding-left: 16px;
    border-bottom: 1px solid #e8f5e9;
}
.configuration-category-item__root:last-child > label {
    border-bottom: 1px solid #4caf50;
}

.configuration-category-item__root > label:hover {
    background-image: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.065),
        rgba(0, 0, 0, 0.0325) 67%,
        rgba(0, 0, 0, 0.065)
    );
}

.configuration-category-item__check {
    flex-shrink: 0;
    padding-top: 4px; /* align to the rule name */
    padding-right: 4px;
}
.configuration-category-item__name {
    flex-grow: 1;
}
.configuration-category-item__link {
    display: block;
    flex-shrink: 0;
}
</style>
