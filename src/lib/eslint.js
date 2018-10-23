import Linter from "eslint4b"
import plugin from "eslint-plugin-vue"
import * as parser from "vue-eslint-parser"

const verifyOptions = Object.freeze({
    preprocess: plugin.processors[".vue"].preprocess,
    postprocess: plugin.processors[".vue"].postprocess,
})

export const linter = new class extends Linter {
    /** Initialize this linter. */
    constructor() {
        super()
        this.defineParser("vue-eslint-parser", parser)
        for (const name of Object.keys(plugin.rules)) {
            this.defineRule(`vue/${name}`, plugin.rules[name])
        }
    }

    /** @inheritdoc */
    verify(textOrSourceCode, config) {
        return super.verify(textOrSourceCode, config, verifyOptions)
    }

    /** @inheritdoc */
    verifyAndFix(text, config) {
        return super.verifyAndFix(text, config, verifyOptions)
    }
}()
