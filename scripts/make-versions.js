"use strict"

const fs = require("fs")

fs.writeFileSync(
    "dist/versions.json",
    JSON.stringify({
        "eslint": require("eslint/package.json").version,
        "eslint-plugin-vue": require("eslint-plugin-vue/package.json").version,
        "vue-eslint-demo": require("../package.json").version,
        "vue-eslint-parser": require("vue-eslint-parser/package.json").version,
    })
)
