export function removeEmptyStringKeys<T extends Record<string, any>>(obj: T): Partial<T> {
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            removeEmptyStringKeys(obj[key])
        } else if (obj[key] === '') {
            delete obj[key]
        }
    }
    return obj
}
