import "@babel/polyfill"
import Vue from "vue"
import App from "./app.vue"

const app = new Vue({
    el: "#main",
    render: h => h(App, { ref: "app" }),
    mounted() {
        window.MainContent.show()
    },
    methods: {
        showUpdateReadyToast() {
            this.$refs.app.showUpdateReadyToast = true
        },
    },
})

// Check update.
window.applicationCache.addEventListener("updateready", () => {
    app.showUpdateReadyToast()
})
