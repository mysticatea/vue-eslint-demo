"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sh = require("shelljs")
const version = require("../package.json").version

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Execute `cp` command.
 * @returns {void}
 */
function cp(...args) {
    sh.echo(`> cp ${args.join(" ")}`)
    sh.cp(...args)
}

/**
 * Execute `rm` command.
 * @returns {void}
 */
function rm(...args) {
    sh.echo(`> rm ${args.join(" ")}`)
    sh.rm(...args)
}

/**
 * Execute a command.
 * @param {string} command The command to execute.
 * @returns {void}
 */
function exec(command) {
    sh.echo(`> ${command}`)
    const code = sh.exec(command, { stdio: "inherit" }).code
    if (code) {
        throw new Error(`Exited with ${code}.`)
    }
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

exec(`git checkout v${version}`)
exec("npm run build")
exec("git checkout gh-pages")

if (String(sh.cat("dist/versions.json")) !== String(sh.cat("versions.json"))) {
    rm("-rf", "vs", "index.*")
    cp("-r", "dist/*", ".")
    exec("git add -A")
    exec("git commit -m \"Update: website\"")
    exec("git push")
}

exec("git checkout master")
