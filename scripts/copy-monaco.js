"use strict"

const childProcess = require("child_process")
const args = process.argv.slice(2)
const root = "node_modules/monaco-editor/min/vs/"
const files = [
    "base/worker/workerMain.js",
    "basic-languages/src/html.js",
    "basic-languages/src/css.js",
    "editor/editor.main.css",
    "editor/editor.main.js",
    "editor/editor.main.nls.js",
    "editor/contrib/suggest/browser/media/String_16x.svg",
    "editor/contrib/suggest/browser/media/String_inverse_16x.svg",
    "editor/standalone/browser/quickOpen/symbol-sprite.svg",
    "language/css/cssMode.js",
    "language/css/cssWorker.js",
    "language/html/htmlMode.js",
    "language/html/htmlWorker.js",
    "language/typescript/lib/typescriptServices.js",
    "language/typescript/src/mode.js",
    "language/typescript/src/worker.js",
    "loader.js",
]
const binFile = "node_modules/cpx/bin/index.js"
const glob = `${root}{${files.join(",")}}`
const dist = "dist/vs"

console.log("> cpx", glob, dist, ...args)
const cp = childProcess.spawn(
    process.execPath,
    [binFile, glob, dist, ...args],
    { stdio: "inherit" }
)
cp.on("exit", (exitCode) => {
    process.exitCode = exitCode
})
