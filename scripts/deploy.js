"use strict"

const { spawn } = require("child_process")
const path = require("path")
const fs = require("fs-extra")
const version = require("../package.json").version
const ATOKEN = process.env.ATOKEN
const BUILD_ROOT = path.resolve(__dirname, "../dist")
const DEPLOY_ROOT = path.resolve(__dirname, "..")

/**
 * Execute a command.
 * @param {string} command The command to execute.
 * @returns {void}
 */
function exec(command) {
    console.log(`> ${command}`)
    return new Promise((resolve, reject) => {
        const cp = spawn(command, [], { shell: true, stdio: "inherit" })

        cp.on("close", code => {
            if (code) {
                reject(new Error(`Exited with ${code}.`))
            } else {
                resolve()
            }
        })
    })
}

// Main
;(async () => {
    console.log("BUILD")
    await exec(`git checkout v${version}`)
    await exec("npm run -s build")

    console.log("LOAD GH-PAGES")
    if (ATOKEN) {
        await exec(
            "git fetch --depth=1 https://github.com/mysticatea/vue-eslint-demo.git gh-pages:gh-pages",
        )
        await exec("git checkout gh-pages")
    } else {
        await exec("git checkout gh-pages")
        await exec("git pull")
    }

    console.log("CHECK VERSIONS")
    const oldVersions = await fs.readFile("versions.json", "utf8")
    const newVersions = await fs.readFile("dist/versions.json", "utf8")
    console.log(`OLD: ${oldVersions}`)
    console.log(`NEW: ${newVersions}`)

    // Deploy.
    if (newVersions !== oldVersions) {
        console.log("CLEAN")
        for (const filename of await fs.readdir(DEPLOY_ROOT)) {
            const stat = await fs.stat(filename)
            if (!stat.isFile() || filename.startsWith(".")) {
                continue
            }

            console.log(`> rm ${filename}`)
            await fs.unlink(filename)
        }

        console.log("DEPLOY")
        for (const filename of await fs.readdir(BUILD_ROOT)) {
            console.log(`> mv dist/${filename} ${filename}`)
            await fs.rename(
                path.join(BUILD_ROOT, filename),
                path.join(DEPLOY_ROOT, filename),
            )
        }

        await exec("git add -A")
        let updated = false
        try {
            await exec('git commit -m "Update: website"')
            updated = true
        } catch (_error) {
            console.log("NO UPDATE")
        }
        if (updated) {
            await exec(
                `git push${
                    ATOKEN
                        ? ` https://mysticatea:${ATOKEN}@github.com/mysticatea/vue-eslint-demo.git gh-pages:gh-pages`
                        : ""
                }`,
            )
        }
    } else {
        console.log("NO UPDATE")
    }

    // Back to master.
    await exec("git checkout master")
    console.log("COMPLETE")
})().catch(error => {
    console.error(error.stack)
    process.exitCode = 1
})
