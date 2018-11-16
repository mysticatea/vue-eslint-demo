import pako from "pako"
import { clone } from "../lib/clone"
import { initialState } from "./initial-state"

/*eslint-disable complexity */
/**
 * Deserialize a given serialized string then update this object.
 * @param {string} serializedString A serialized string.
 * @returns {object} The deserialized state.
 */
export function deserializeState(serializedString) {
    const state = clone(initialState)

    if (serializedString === "") {
        return state
    }

    try {
        // For backward compatibility, it can address non-compressed data.
        const compressed = !serializedString.startsWith("eyJj")
        const decodedText = atob(serializedString)
        const jsonText = compressed
            ? pako.inflate(decodedText, { to: "string" })
            : decodedText
        const json = JSON.parse(jsonText)

        if (typeof json === "object" && json !== null) {
            if (typeof json.code === "string") {
                state.code = json.code
            }
            if (typeof json.rules === "object" && json.rules !== null) {
                for (const id of Object.keys(state.config.rules)) {
                    state.config.rules[id] = json.rules[id] ? 2 : 0
                }
            }
            if (
                json.indentSize === 2 ||
                json.indentSize === 4 ||
                json.indentSize === 8
            ) {
                state.indentSize = json.indentSize
            }
            if (json.indentType === "space" || json.indentType === "tab") {
                state.indentType = json.indentType
            }
            if (
                json.parser === "espree" ||
                json.parser === "babel-eslint" ||
                json.parser === "typescript-eslint-parser"
            ) {
                state.config.parserOptions.parser = json.parser
            }
        }
    } catch (error) {
        console.error(error)
    }

    return state
}
/*eslint-enable complexity */
