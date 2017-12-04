import pako from "pako"
import defaultCode from "./default-code.js"
import defaultConfig from "./default-config.js"

/**
 * @typedef {Object} State
 * @property {string} code The source code the user input.
 * @property {Object} config The config object to lint.
 * @property {(2|4|8)} indentSize The indent size to set the editor.
 * @property {("space"|"tab")} indentType The indent type to set the editor.
 * @property {("codeAndFixedCode"|"codeOnly")} editorType The editor type to set the editor.
 * @property {Object[]} messages The error messages of the linting result.
 * @property {string} fixedCode The auto-fixed code.
 * @property {Object[]} fixedMessages The error messages of the linting result with `--fix`.
 */

/**
 * Convert an Unicode string to base64.
 * @param {string} text The string to convert.
 * @returns {string} Base64 string.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#Unicode_strings
 */
function encodeToBase64(text) {
    return window.btoa(unescape(encodeURIComponent(text)))
}

/**
 * Convert a base64 string to Unicode.
 * @param {string} base64 The string to convert.
 * @returns {string} Unicode string.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa#Unicode_strings
 */
function decodeFromBase64(base64) {
    return decodeURIComponent(escape(window.atob(base64)))
}

/**
 * Create the default state.
 * @returns {State} The created state.
 */
function createDefaultState() {
    const code = defaultCode
    const config = Object.assign({}, defaultConfig)
    config.rules = Object.assign({}, defaultConfig.rules)

    return {
        code,
        config,
        indentSize: 2,
        indentType: "space",
        editorType: "codeAndFixedCode",
        messages: [],
        fixedCode: code,
        fixedMessages: [],
    }
}

/**
 * Initialize state.
 * @param {string} serializedText The string to deserialize.
 * @returns {State} The created state.
 */
export function deserializeState(serializedText) { //eslint-disable-line complexity
    const state = createDefaultState()

    try {
        // For backward compatibility, it can address non-compressed data.
        const compressed = !serializedText.startsWith("eyJj")
        const decodedText = decodeFromBase64(serializedText)
        const jsonText = compressed ? pako.inflate(decodedText, { to: "string" }) : decodedText
        const json = JSON.parse(jsonText)

        if (typeof json === "object" && json !== null) {
            if (typeof json.code === "string") {
                state.code = json.code
            }
            if (typeof json.rules === "object" && json.rules !== null) {
                for (const id of Object.keys(state.config.rules)) {
                    state.config.rules[id] = (json.rules[id] ? 2 : 0)
                }
            }
        }
        if (json.indentSize === 2 || json.indentSize === 4 || json.indentSize === 8) {
            state.indentSize = json.indentSize
        }
        if (json.indentType === "space" || json.indentType === "tab") {
            state.indentType = json.indentType
        }
        if (json.editorType === "codeAndFixedCode" || json.editorType === "codeOnly") {
            state.editorType = json.editorType
        }
    }
    catch (_err) {
        // ignores.
    }

    return state
}

/**
 * Create the base64
 * @param {State} state The state object.
 * @returns {string} Serialized string.
 */
export function serializeState(state) {
    const code = state.code
    const fullRules = state.config.rules
    const rules = Object.keys(fullRules).reduce(
        (map, id) => {
            if (fullRules[id] === 2) {
                map[id] = 2
            }
            return map
        },
        {}
    )
    const indentSize = state.indentSize
    const indentType = state.indentType
    const editorType = state.editorType
    const jsonText = JSON.stringify({ code, rules, indentSize, indentType, editorType })
    const compressedText = pako.deflate(jsonText, { to: "string" })
    return encodeToBase64(compressedText)
}
