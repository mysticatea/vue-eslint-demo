import Vue from "vue"
import App from "./app.vue"

const app = new Vue({
    computed: {
        updateReady: {
            get() {
                return this.$refs.app.showUpdateReadyToast
            },
            set(value) {
                this.$refs.app.showUpdateReadyToast = value
            },
        },
    },
    render: (h) => h(App, { ref: "app" }),
})
app.$mount("#main")

// Check update.
window.addEventListener("load", () => {
    applicationCache.addEventListener("updateready", () => {
        if (applicationCache.status === applicationCache.UPDATEREADY) {
            app.updateReady = true
        }
    })
})
