/**
 * Clone a given value deeply.
 * @param {any} x The value to clone.
 * @returns {any} The cloned value.
 */
export function clone(x) {
    if (typeof x !== "object" || x === null) {
        return x
    }
    if (Array.isArray(x)) {
        return x.slice()
    }

    const y = {}
    for (const key of Object.keys(x)) {
        if (key !== "__proto__") {
            y[key] = clone(x[key])
        }
    }
    return y
}
