<template>
    <ul
        class="message-list__root"
    >
        <li
            class="message-list__item no-errors"
            v-if="messages.length === 0"
        >
            No errors.
        </li>
        <li
            class="message-list__item"
            v-for="(m, i) of messages"
            :key="i"
        >
            <md-icon kind="warning"/>
            {{ m.line }}:{{ m.column }}{{ space(m) }}{{ m.message }} (<a :href="url(m.ruleId)" target="_blank" v-if="m.ruleId != null">{{ m.ruleId }}</a><span v-else>FATAL</span>)
        </li>
    </ul>
</template>

<script>
import MdIcon from "./md-icon.vue"
import { getRuleUrl } from "./util.js"

export default {
    name: "MessageList",

    components: { MdIcon },

    props: {
        messages: {
            type: Array,
            default() {
                return []
            },
        },
    },

    methods: {
        space(message) {
            const width = `${message.line}:${message.column}`.length
            return "\u2007".repeat(Math.max(1, 8 - width))
        },

        url: getRuleUrl,
    },
}
</script>

<style>
.message-list__root {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: scroll;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHElEQVQYV2O8e/fuf2VlZUYGKIAzMARgKjFUAABhrQgFvaGkawAAAABJRU5ErkJggg==) repeat;
}

.message-list__item {
    margin: 0;
    padding: 4px 8px;
    border-bottom: 1px dotted #CCC;
    background-color: white;
    color: #B71C1C;
}
.message-list__item.no-errors {
    color: #333333;
}
</style>
