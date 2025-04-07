export const objectToQuery = (obj: Record<string, any> = {}) => {
    const query = Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
    return query
}
