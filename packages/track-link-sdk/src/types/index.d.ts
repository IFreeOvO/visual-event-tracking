import { EventMethods, EventType, RouterMethods, WS_FROM } from '@/shared/constants'

export type AnyClass = new (...args: any[]) => any

export interface Dependency {
    token: string
    propertyName: string | symbol
}

export interface ClassProvider {
    definition: AnyClass
    constructorArgs: any[]
}

export type Provider =
    | ClassProvider
    | string
    | number
    | boolean
    | undefined
    | null
    | Record<string, any>

export interface Message<T = Record<string, any>> {
    event: string
    data: T
}

export interface PostMessageData<T = Record<string, any>> {
    type: EventType
    method: EventMethods
    params?: T
}

export interface SocketOptions {
    devtoolURL: `ws://${string}` | `wss://${string}`
    channelId?: string
    from: WS_FROM
}

export interface Protocol {
    id: string
    method?: string
    params?: Record<string, any>
}

export interface SocketConfig {
    devtoolURL: `ws://${string}` | `wss://${string}`
    channelId?: string
}

export interface SDKConfig {
    trackingClientURL: `http://${string}` | `https://${string}`
    socket: SocketConfig
    router?: {
        routerHandler?: (
            method: RouterMethods,
            event: any,
            notifications: {
                forward: (e: any) => void
                replace: (e: any) => void
                popstate: (e: any) => void
            },
        ) => void
    }
}

export interface SendIframeInfoParams {
    fullPath: string
    origin: string
}

export interface ReceiveTrackingDataParams {
    xpath: string
    snapshotBlob: Blob
    validationMarker: string
}
