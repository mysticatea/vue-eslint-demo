import Vue from "vue"
import App from "./app.vue"

new Vue({
    render: (h) => h(App, {
        on: {
            initialize() {
                window.MainContent.show()
            },
        },
    }),
}).$mount("#main")
