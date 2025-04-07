export interface FilterRule {
    field: string
    condition: '$eq' | '$contL'
}

// 统一filter格式。例如{age: 2, name: 'jack'}，转成filter=age||$eq||2&filter=name||$eq||jack
export const formatFilter = (
    data: Record<string, string | number | undefined> = {},
    rules: FilterRule[],
) => {
    const conditions: string[] = []
    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== undefined) {
            const currentRule = rules.find((rule) => rule.field === key)
            if (currentRule) {
                const condition = `filter=${key}||${currentRule.condition}||${encodeURIComponent(value)}`
                conditions.push(condition)
            }
        }
    })
    return conditions.join('&')
}
