import defaultCode from "./default-code.js"
import defaultConfig from "./default-config.js"

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
 * @returns {{config:any,code:string,showFixedCode:boolean}} The created state.
 */
function createDefaultState() {
    const code = defaultCode
    const config = Object.assign({}, defaultConfig)
    config.rules = Object.assign({}, defaultConfig.rules)
    const showFixedCode = true

    return { code, config, showFixedCode }
}

/**
 * Initialize state.
 * @param {string} serializedText The string to deserialize.
 * @returns {{config:any,code:string,showFixedCode:boolean}} The created state.
 */
export function deserializeState(serializedText) {
    const state = createDefaultState()

    try {
        const jsonText = decodeFromBase64(serializedText)
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
    }
    catch (_err) {
        // ignores.
    }

    return state
}

/**
 * Create the base64
 * @param {object} state The state object.
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
    return encodeToBase64(JSON.stringify({ code, rules }))
}
