import { linter } from "./eslint"

/**
 * Get the document URL of a rule.
 * @param {string} ruleId The rule ID to get.
 * @returns {string|null} The document URL of the rule.
 */
export function getRuleUrl(ruleId) {
    const rule = linter.getRules().get(ruleId)
    const meta = rule && rule.meta
    const docs = meta && meta.docs
    const url = docs && docs.url
    return url || null
}
