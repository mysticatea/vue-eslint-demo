/**
 * Select indent type.
 * @param {State} state The previous state
 * @param {string} indentType The new indent type.
 * @returns {State} The next state.
 */
export function selectIndentType(state, indentType) {
    state.indentType = indentType
}
