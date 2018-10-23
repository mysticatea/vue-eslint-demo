/**
 * Select parser.
 * @param {State} state The previous state
 * @param {string} parserId The new parser ID.
 * @returns {State} The next state.
 */
export function selectParser(state, parserId) {
    state.config.parserOptions.parser = parserId
}
