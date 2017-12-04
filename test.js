const eslint = require("eslint")
const linter = new eslint.Linter()
const rules = linter.getRules()

for (const [id, rule] of rules) {
    if (rule.meta.docs.recommended) {
        console.log(id)
    }
}
