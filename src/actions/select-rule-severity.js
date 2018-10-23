/**
 * Select rule's severity.
 * @param {State} state The previous state
 * @param {string|string[]} ruleIdOrRuleIds The rule ID to update severity.
 * @param {number} severity The new severity.
 * @returns {State} The next state.
 */
export function selectRuleSeverity(state, ruleIdOrRuleIds, severity) {
    const severityMap = state.config.rules

    if (Array.isArray(ruleIdOrRuleIds)) {
        for (const ruleId of ruleIdOrRuleIds) {
            severityMap[ruleId] = severity
        }
    } else {
        const ruleId = ruleIdOrRuleIds
        severityMap[ruleId] = severity
    }
}
