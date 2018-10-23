<template>
    <ul
        class="message-list__root"
    >
        <li
            v-if="messages.length === 0"
            class="message-list__item no-errors"
        >
            No errors.
        </li>
        <li
            v-for="(m, i) of messages"
            :key="i"
            class="message-list__item"
        >
            <md-icon kind="warning" />
            {{ m.line }}:{{ m.column }}{{ space(m) }}{{ m.message }} (<a
                v-if="m.ruleId != null"
                :href="url(m.ruleId)"
                target="_blank"
                rel="noopener"
            >
                {{ m.ruleId }}
            </a><span v-else>
                FATAL
            </span>)
        </li>
    </ul>
</template>

<script>
import { getRuleUrl } from "./lib/get-rule-url"
import MdIcon from "./md-icon.vue"

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
}

.message-list__item {
    margin: 0;
    padding: 4px 8px;
    border-bottom: 1px dotted #ccc;
    background-color: white;
    color: #b71c1c;
}
.message-list__item.no-errors {
    color: #333333;
}
</style>
