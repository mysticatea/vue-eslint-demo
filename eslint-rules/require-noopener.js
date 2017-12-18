"use strict"

module.exports = (context) =>
    context.parserServices.defineTemplateBodyVisitor({
        "VElement[name='a']"(node) {
            const attributes = node.startTag.attributes
            const hasTargetBlank = attributes.some(attribute =>
                !attribute.directive &&
                attribute.key.name === "target" &&
                attribute.value != null &&
                attribute.value.value === "_blank"
            )
            const hasRelNoopener = attributes.some(attribute =>
                !attribute.directive &&
                attribute.key.name === "rel" &&
                attribute.value != null &&
                attribute.value.value === "noopener"
            )

            if (hasTargetBlank && !hasRelNoopener) {
                context.report({
                    node: node.startTag,
                    message: "Use 'rel=\"noopener\"' to open new tab.",
                    * fix(fixer) {
                        const lastAttribute = attributes[attributes.length - 1]
                        yield fixer.insertTextAfter(lastAttribute, " rel=\"noopener\"")
                    },
                })
            }
        },
    })
