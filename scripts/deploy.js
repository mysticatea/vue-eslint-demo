"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const sh = require("shelljs")
const version = require("../package.json").version
const ATOKEN = process.env.ATOKEN //eslint-disable-line no-process-env

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

// Build.
exec(`git checkout v${version}`)
exec("npm run build")

// Load gh-pages.
if (ATOKEN) {
    exec("git fetch --depth=1 https://github.com/mysticatea/vue-eslint-demo.git gh-pages:gh-pages")
}
exec("git checkout gh-pages")

// Check versions.
const oldVersions = String(sh.cat("versions.json"))
const newVersions = String(sh.cat("dist/versions.json"))
sh.echo(`OLD: ${oldVersions}`)
sh.echo(`NEW: ${newVersions}`)

// Deploy.
if (newVersions !== oldVersions) {
    rm("-rf", "vs", "index.*")
    cp("-r", "dist/*", ".")
    exec("git add -A")
    exec("git commit -m \"Update: website\"")
    exec(`git push${ATOKEN ? ` https://mysticatea:${ATOKEN}@github.com/mysticatea/vue-eslint-demo.git gh-pages:gh-pages` : ""}`)
}

// Back to master.
exec("git checkout master")
