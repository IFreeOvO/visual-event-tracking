import type ReconnectingWebSocket from 'reconnecting-websocket'
import DOM from './domain/DOM'
import Overlay from './domain/Overlay'

interface CDPOptions {
    socket: ReconnectingWebSocket
}

export interface CDP {
    DOM: DOM
    Overlay: Overlay
    [otherDomain: string]: any
}

export default async function createCDP(
    options: CDPOptions,
    callback?: (cdp: CDP) => void,
): Promise<CDP> {
    if (typeof options !== 'object') {
        throw new Error('CDP options must be an object')
    }

    if (!options.socket) {
        throw new Error('the parameter "socket" is required')
    }
    const chobitsu = (await import('chobitsu')).default as any

    chobitsu.setOnMessage((message: string) => {
        options.socket.send(message)
    })

    const cdp: CDP = {
        DOM: new DOM(chobitsu.domains),
        Overlay: new Overlay(chobitsu.domains),
    }

    if (typeof callback === 'function') {
        callback(cdp)
    }

    return cdp
}
