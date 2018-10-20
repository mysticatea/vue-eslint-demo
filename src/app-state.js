import pako from "pako"
import defaultCode from "./app-state/default-code.js"
import defaultConfig from "./app-state/default-config.js"
import { linter, ruleCategories } from "./app-state/eslint.js"

export { ruleCategories }

/**
 * Get the document URL of a rule.
 * @param {string} ruleId The rule ID to get.
 * @returns {string|null} The document URL of the rule.
 */
export function getRuleUrl(ruleId) {
    return linter.getRules().get(ruleId).meta.docs.url
}

/**
 * The state object for this application.
 */
export default class PlaygroundState {
    /**
     * Initialize this state.
     * @param {string} [serializedString] A serialized string to restore the state.
     */
    constructor(serializedString = "") {
        const code = defaultCode
        const config = { ...defaultConfig }
        config.rules = { ...defaultConfig.rules }
        config.parserOptions = { ...defaultConfig.parserOptions }

        this.code = code
        this.config = config
        this.indentSize = 2
        this.indentType = "space"
        this.editorType = "codeAndFixedCode"
        this.messages = []
        this.fixedCode = code
        this.fixedMessages = []
        this.showUpdateReadyToast = false

        const deserialized =
            typeof serializedString === "string" &&
            this.deserialize(serializedString)

        // Ensure the correct messages, fixedCode, and fixedMessages.
        if (!deserialized) {
            this.lint()
        }
    }

    /**
     * Enabled rules.
     * @returns {object} The map-like object. Keys are the ID of enabled rules. Every value is 2.
     */
    get _enabledRules() {
        const allRules = this.config.rules
        return Object.keys(allRules).reduce((map, id) => {
            if (allRules[id] === 2) {
                map[id] = 2
            }
            return map
        }, {})
    }

    /**
     * Actual config object to lint.
     * @type {object}
     */
    get _configToLint() {
        // Adjust the indentation options to the editor settings.
        const config = { ...this.config }
        const rules = (config.rules = { ...this.config.rules })
        const indentType = this.indentType === "space" ? this.indentSize : "tab"
        rules.indent = [rules.indent, indentType]
        rules["vue/html-indent"] = [rules["vue/html-indent"], indentType]

        return config
    }

    /**
     * Serialize this state as a base64 string.
     * @returns {string} The serialized string.
     */
    serialize() {
        const jsonString = JSON.stringify({
            code: this.code,
            rules: this._enabledRules,
            indentSize: this.indentSize,
            indentType: this.indentType,
            editorType: this.editorType,
            parser: this.config.parserOptions.parser,
        })
        const compressedString = pako.deflate(jsonString, { to: "string" })

        return btoa(compressedString)
    }

    /*eslint-disable complexity */
    /**
     * Deserialize a given serialized string then update this object.
     * @param {string} serializedString A serialized string.
     * @returns {boolean} `true` if this state object was changed.
     */
    deserialize(serializedString) {
        if (serializedString === "") {
            return false
        }
        try {
            // For backward compatibility, it can address non-compressed data.
            const compressed = !serializedString.startsWith("eyJj")
            const decodedText = atob(serializedString)
            const jsonText = compressed
                ? pako.inflate(decodedText, { to: "string" })
                : decodedText
            const json = JSON.parse(jsonText)
            let changed = false

            if (typeof json === "object" && json !== null) {
                if (typeof json.code === "string" && json.code !== this.code) {
                    this.code = json.code
                    changed = true
                }
                if (typeof json.rules === "object" && json.rules !== null) {
                    for (const id of Object.keys(this.config.rules)) {
                        const value = json.rules[id] ? 2 : 0
                        if (value !== this.config.rules[id]) {
                            this.config.rules[id] = value
                            changed = true
                        }
                    }
                }
                if (
                    (json.indentSize === 2 ||
                        json.indentSize === 4 ||
                        json.indentSize === 8) &&
                    json.indentSize !== this.indentSize
                ) {
                    this.indentSize = json.indentSize
                    changed = true
                }
                if (
                    (json.indentType === "space" ||
                        json.indentType === "tab") &&
                    json.indentType !== this.indentType
                ) {
                    this.indentType = json.indentType
                    changed = true
                }
                if (
                    (json.editorType === "codeAndFixedCode" ||
                        json.editorType === "codeOnly") &&
                    json.editorType !== this.editorType
                ) {
                    this.editorType = json.editorType
                    changed = true
                }
                if (
                    (json.parser === "espree" ||
                        json.parser === "babel-eslint") &&
                    json.parser !== this.config.parserOptions.parser
                ) {
                    this.config.parserOptions.parser = json.parser
                }
            }

            // Update messages, fixedCode, and fixedMessages.
            if (changed) {
                this.lint()
            }

            return changed
        } catch (error) {
            console.error(error)
            return false
        }
    }
    /*eslint-enable complexity */

    /**
     * Execute ESLint to update messages, fixedCode, and fixedMessages.
     * @returns {void}
     */
    lint() {
        const config = this._configToLint

        // Lint
        try {
            this.messages = linter.verify(this.code, config)
        } catch (err) {
            this.messages = [
                {
                    fatal: true,
                    severity: 2,
                    message: err.message,
                    line: 1,
                    column: 0,
                },
            ]
        }

        // Fix
        try {
            const ret = linter.verifyAndFix(this.code, config)
            this.fixedCode = ret.output
            this.fixedMessages = ret.messages
        } catch (err) {
            this.fixedCode = this.code
            this.fixedMessages = [
                {
                    fatal: true,
                    severity: 2,
                    message: err.message,
                    line: 1,
                    column: 0,
                },
            ]
        }
    }
}
