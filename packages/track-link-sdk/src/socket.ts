import type { Message, Protocol, SocketConfig } from './types'
import type { CDP } from '@/cdp/index'
import ReconnectingWebSocket from 'reconnecting-websocket'
import createCDP from '@/cdp/index'
import { EventType, GLOBAL_PROVIDERS, WS_FROM } from '@/shared/constants'
import { Inject, Module } from '@/shared/decorator'

@Module()
class Socket {
    websocket?: ReconnectingWebSocket

    heartbeat?: ReturnType<typeof setTimeout>

    interval: number = 10 * 1000

    cdp?: CDP

    @Inject({
        provider: GLOBAL_PROVIDERS.SocketConfig,
    })
    socketConfig?: SocketConfig

    constructor() {
        // 管理后台会创建channelId，然后把channelId存到window.name
        const { devtoolURL = '', channelId = window.name } = this.socketConfig || {}
        if (devtoolURL) {
            this.websocket = new ReconnectingWebSocket(this._getWebSocketUrl(devtoolURL, channelId))
        }
    }

    private _getWebSocketUrl(devtoolURL: string, channelId: string): string {
        return `${devtoolURL}?channelId=${channelId}&from=${WS_FROM.CLIENT}`
    }

    async bootstrap() {
        if (!this.cdp && this.websocket) {
            this.cdp = await createCDP({
                socket: this.websocket,
            })
        }

        this._registerEventListeners()
    }

    private _registerEventListeners() {
        this.websocket?.addEventListener('open', this._onOpen.bind(this))
        this.websocket?.addEventListener('error', this._onError.bind(this))
        this.websocket?.addEventListener('message', this._onMessage.bind(this))
        this.websocket?.addEventListener('close', this._onClose.bind(this))
    }

    private _clearHeartbeat() {
        if (this.heartbeat) {
            clearInterval(this.heartbeat)
            this.heartbeat = undefined
        }
    }

    send(message: string) {
        this.websocket?.send(message)
    }

    private _onOpen() {
        this.heartbeat = setInterval(() => {
            this.websocket?.send('{}')
        }, this.interval)
    }

    private _onClose() {
        this._clearHeartbeat()
    }

    private _onError() {
        this._clearHeartbeat()
    }

    private _onMessage({ data }: MessageEvent) {
        const message: Message = JSON.parse(data)
        this._execCommand(message)
    }

    private async _execCommand(message: Message) {
        const { event, data } = message
        if (event === EventType.CDP) {
            const ret = await this._execCDPCommand(data as Protocol)

            if (ret) {
                this.websocket?.send(JSON.stringify(ret))
            }
        }
    }

    private async _execCDPCommand(protocol: Protocol) {
        const { id, method = '', params = {} } = protocol
        const [domain, methodName] = method.split('.')
        const cdp = this.cdp

        // 不处理<!DOCTYPE html>节点
        const isDOCTYPENode = params.nodeId === 2
        if (!cdp || isDOCTYPENode) {
            return
        }

        // 没有实现的cdp方法直接返回id
        if (!cdp[domain]) {
            return { id }
        }

        const command = cdp[domain][methodName]
        if (typeof command !== 'function') {
            return { id }
        }

        const result = command.call(cdp[domain], params)
        return {
            id,
            result,
        }
    }
}
export default Socket
