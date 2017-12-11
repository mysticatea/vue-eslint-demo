/**
 * Get the document URL of a rule.
 * @param {string} ruleId The rule ID to get.
 * @returns {string|null} The document URL of the rule.
 */
export function getRuleUrl(ruleId) {
    if (ruleId == null) {
        return null
    }
    return ruleId.startsWith("vue/")
        ? `https://github.com/vuejs/eslint-plugin-vue/tree/master/docs/rules/${ruleId.replace("vue/", "")}.md`
        : `https://eslint.org/docs/rules/${ruleId}`
}
