<template>
    <div class="app__root">
        <app-header
            class="app__header"
            :indent-size="state.indentSize"
            :indent-type="state.indentType"
        />
        <div class="app__body">
            <configuration
                :config="state.config"
            />
            <playground
                :code="state.code"
                :config="state.config"
                :indent-size="state.indentSize"
                :indent-type="state.indentType"
            />
        </div>
        <app-footer class="app__footer" />

        <appcache-toast :show="showUpdateReadyToast" />
    </div>
</template>

<script>
import { deserializeState, serializeState } from "./state"
import AppFooter from "./app-footer.vue"
import AppHeader from "./app-header.vue"
import AppcacheToast from "./appcache-toast.vue"
import Configuration from "./configuration.vue"
import Playground from "./playground.vue"

export default {
    name: "App",

    components: {
        AppFooter,
        AppHeader,
        AppcacheToast,
        Configuration,
        Playground,
    },

    provide() {
        return {
            // Handle actions.
            sendAction: (action, ...args) => {
                action(this.state, ...args)
                this.applyUrlHash()
            },
        }
    },

    data() {
        const serializedString = location.hash.slice(1)
        return {
            serializedString,
            state: deserializeState(serializedString),
            showUpdateReadyToast: false,
        }
    },

    mounted() {
        window.addEventListener("hashchange", this.onUrlHashChange)
    },
    beforeDestroey() {
        window.removeEventListener("hashchange", this.onUrlHashChange)
    },

    methods: {
        onUrlHashChange() {
            const serializedString = location.hash.slice(1)
            if (serializedString !== this.serializedString) {
                this.serializedString = serializedString
                this.state = deserializeState(serializedString)
            }
        },

        applyUrlHash() {
            const serializedString = serializeState(this.state)
            if (serializedString !== this.serializedString) {
                this.serializedString = serializedString
                location.replace(`#${serializedString}`)
            }
        },
    },
}
</script>

<style>
a {
    color: inherit;
}
a:hover {
    color: #2196f3;
}

select,
button {
    font-family: inherit;
}

.app__root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAHElEQVQYV2O8e/fuf2VlZUYGKIAzMARgKjFUAABhrQgFvaGkawAAAABJRU5ErkJggg==)
        repeat;
}

.app__header {
    flex-shrink: 0;
}

.app__body {
    display: flex;
    flex-grow: 1;
    min-height: 0;
}
.app__body > :first-child {
    flex-shrink: 0;
    width: calc(25% - 1px);
    border-right: 1px solid #ccc;
}
.app__body > :last-child {
    flex-grow: 1;
}

.app__footer {
    flex-shrink: 0;
}
</style>
