export function makeAbility(tableName: string, actionName: string): string {
    return `${tableName}:${actionName}`
}
