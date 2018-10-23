import defaultCode from "./default-code"
import defaultConfig from "./default-config"
export * from "../lib/eslint"

/**
 * The initial state.
 */
export const initialState = Object.freeze({
    code: defaultCode,
    config: defaultConfig,
    indentType: "space",
    indentSize: 2,
})
