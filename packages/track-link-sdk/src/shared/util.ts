import { customAlphabet } from 'nanoid'
import { SessionKeys } from '@/shared/constants'

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// 获取客户端标识id。由管理后台创建channelId，然后把channelId分发给devtool和iframe
export function createChannelId(length: number = 10): string {
    let id = sessionStorage.getItem(SessionKeys.CLIENT_ID)
    if (!id) {
        const nanoid = customAlphabet(
            '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            10,
        )
        id = nanoid(length)
        sessionStorage.setItem(SessionKeys.CLIENT_ID, id)
    }

    return id
}

export function throttle<T extends any[]>(
    fn: (...args: T) => void,
    delay = 60,
): (...args: T) => void {
    let lastTime = Date.now()
    let timer: ReturnType<typeof setTimeout> | null = null
    return function (this: any, ...args: T) {
        const currentTime = Date.now()
        const diffTime = currentTime - lastTime
        if (timer) {
            clearTimeout(timer)
        }
        if (diffTime > delay) {
            timer = null
            lastTime = currentTime
            fn.apply(this, args)
        } else {
            timer = setTimeout(() => {
                timer = null
                lastTime = currentTime
                fn.apply(this, args)
            }, delay - diffTime)
        }
    }
}
