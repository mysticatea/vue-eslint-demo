/**
 * Select indent size.
 * @param {State} state The previous state
 * @param {number} indentSize The new indent size.
 * @returns {State} The next state.
 */
export function selectIndentSize(state, indentSize) {
    state.indentSize = indentSize
}
