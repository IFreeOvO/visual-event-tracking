import { LocalStorageEnum } from '@/constants/local-storage'

export function getLocalStorage<T = any>(key: LocalStorageEnum): T {
    const value = localStorage.getItem(key)

    switch (value) {
        case null:
            return undefined as T
        case '':
            return '' as T
        case 'true':
            return true as T
        case 'false':
            return false as T
        case 'null':
            return null as T
        case 'undefined':
            return undefined as T
        default:
            break
    }

    try {
        return JSON.parse(value)
    } catch (err) {
        console.error(err)
        return undefined as T
    }
}

export function setLocalStorage<T>(key: LocalStorageEnum, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
}

export const removeLocalStorage = (key: LocalStorageEnum) => {
    localStorage.removeItem(key)
}
