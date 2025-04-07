import type { GetModuleInfo } from 'rollup'

export function staticImportedByEntry(
    id: string,
    getModuleInfo: GetModuleInfo,
    cache: Map<any, any>,
    importStack: any[] = [],
) {
    if (cache.has(id)) {
        return !!cache.get(id)
    }
    if (importStack.includes(id)) {
        cache.set(id, false)
        return false
    }
    const moduleInfo = getModuleInfo(id)
    if (!moduleInfo) {
        cache.set(id, false)
        return false
    }
    if (moduleInfo.isEntry) {
        cache.set(id, true)
        return true
    }
    const isIncluded = moduleInfo.importers.some((importer: string) =>
        staticImportedByEntry(importer, getModuleInfo, cache, importStack.concat(id)),
    )
    cache.set(id, isIncluded)
    return isIncluded
}
