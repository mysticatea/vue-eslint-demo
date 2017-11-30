/*eslint-env node */

const fs = require("fs")
const WHITELIST = new Set([
    "/vue-eslint-demo/index.html",
    "/vue-eslint-demo/index.js",
    "/vue-eslint-demo/vs/base/worker/workerMain.js",
    "/vue-eslint-demo/vs/basic-languages/src/html.js",
    "/vue-eslint-demo/vs/editor/editor.main.css",
    "/vue-eslint-demo/vs/editor/editor.main.js",
    "/vue-eslint-demo/vs/editor/editor.main.nls.js",
    "/vue-eslint-demo/vs/editor/contrib/suggest/browser/media/String_16x.svg",
    "/vue-eslint-demo/vs/editor/contrib/suggest/browser/media/String_inverse_16x.svg",
    "/vue-eslint-demo/vs/editor/standalone/browser/quickOpen/symbol-sprite.svg",
    "/vue-eslint-demo/vs/language/css/cssMode.js",
    "/vue-eslint-demo/vs/language/css/cssWorker.js",
    "/vue-eslint-demo/vs/language/html/htmlMode.js",
    "/vue-eslint-demo/vs/language/html/htmlWorker.js",
    "/vue-eslint-demo/vs/language/typescript/lib/typescriptServices.js",
    "/vue-eslint-demo/vs/language/typescript/src/mode.js",
    "/vue-eslint-demo/vs/language/typescript/src/worker.js",
    "/vue-eslint-demo/vs/loader.js",
])

const original = fs.readFileSync("dist/index.appcache", "utf8")
const modified = original.split("\n")
    .filter(line => !line.startsWith("/") || WHITELIST.has(line))
    .join("\n")

fs.writeFileSync("dist/index.appcache", modified)
