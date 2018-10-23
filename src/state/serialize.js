import pako from "pako"

/**
 * Get only enabled rules to make the serialized data smaller.
 * @param {object} allRules The rule settings.
 * @returns {object} The rule settings for the enabled rules.
 */
function getEnabledRules(allRules) {
    return Object.keys(allRules).reduce((map, id) => {
        if (allRules[id] === 2) {
            map[id] = 2
        }
        return map
    }, {})
}

/**
 * Serialize a given state as a base64 string.
 * @param {State} state The state to serialize.
 * @returns {string} The serialized string.
 */
export function serializeState(state) {
    const jsonString = JSON.stringify({
        code: state.code,
        rules: getEnabledRules(state.config.rules),
        indentSize: state.indentSize,
        indentType: state.indentType,
        parser: state.config.parserOptions.parser,
    })
    const compressedString = pako.deflate(jsonString, { to: "string" })
    const base64 = btoa(compressedString)

    //eslint-disable-next-line no-console
    console.log(
        `The compress rate of serialized string: ${(
            (100 * base64.length) /
            jsonString.length
        ).toFixed(1)}% (${jsonString.length}B → ${base64.length}B)`,
    )

    return base64
}
