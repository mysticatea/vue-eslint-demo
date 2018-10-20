import Vue from "vue"
import App from "./app.vue"

const app = new Vue({
    el: "#main",
    methods: {
        showUpdateReadyToast() {
            this.$refs.app.showUpdateReadyToast = true
        },
    },
    render: h => h(App, { ref: "app" }),
})

// Check update.
window.applicationCache.addEventListener("updateready", () => {
    app.showUpdateReadyToast()
})
