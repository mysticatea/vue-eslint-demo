import { linter } from "./eslint"

// Initialize the categories of rules.
/** @type {{name:string,rules:{name:string,description:string,fixable:boolean}[]}[]} */
export const ruleCategories = (() => {
    const ruleMap = linter.getRules()
    const categoryMap = {
        essential: {
            name: "Priority A: Essential",
            rules: [],
        },
        "strongly-recommended": {
            name: "Priority B: Strongly Recommended",
            rules: [],
        },
        recommended: {
            name: "Priority C: Recommended",
            rules: [],
        },
        "use-with-caution": {
            name: "Priority D: Use with Caution",
            rules: [],
        },
        uncategorized: {
            name: "Uncategorized",
            rules: [],
        },
        base: {
            name: "Base Rules",
            rules: [],
        },
        core: {
            name: "ESLint Core Rules",
            rules: [],
        },
    }
    for (const entry of ruleMap) {
        const name = entry[0]
        const meta = entry[1].meta
        if (meta == null || meta.docs == null || meta.deprecated) {
            continue
        }
        const category = name.startsWith("vue/")
            ? categoryMap[meta.docs.category] || categoryMap.uncategorized
            : categoryMap.core

        category.rules.push({
            name,
            description: meta.docs.description || "no description",
            url: meta.docs.url,
            fixable: Boolean(meta.fixable),
        })
    }

    return Object.keys(categoryMap).map(id => categoryMap[id])
})()
