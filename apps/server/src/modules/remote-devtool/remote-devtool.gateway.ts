import type { WebSocket } from 'ws'
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { WS_FROM } from '@/shared/constants'
import { parseSearchParams } from '@/shared/parse-search-params'
import { RemoteDevtoolService } from './remote-devtool.service'

// chrome-devtool的后端服务
@WebSocketGateway({
    path: '/api/v1/remote/devtool',
    cors: '*',
})
export class RemoteDevtoolGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly remoteDevtoolService: RemoteDevtoolService) {}

    clients: Record<string, WebSocket> = {} // 记录来自被埋点项目的连接

    devtools: Record<string, WebSocket> = {} // 记录来自devtool的连接

    connections: WeakMap<WebSocket, Record<string, string>> = new WeakMap() // 记录所有连接

    handleConnection(client: WebSocket, ...args: any[]) {
        const [{ url }] = args
        const { channelId, from } = parseSearchParams(url)
        if (!channelId || !from) {
            client.close()
            return
        }
        this.connections.set(client, {
            channelId,
            from,
        })

        if (from === WS_FROM.CLIENT) {
            this.clients[channelId] = client
            client.on('message', (message: Buffer) => {
                this.remoteDevtoolService.handleClientReceived(
                    channelId,
                    message.toString(),
                    this.clients,
                    this.devtools,
                )
            })
        } else if (from === WS_FROM.DEVTOOL) {
            this.devtools[channelId] = client
            client.on('message', (message: Buffer) => {
                this.remoteDevtoolService.handleDevtoolReceived(
                    channelId,
                    message.toString(),
                    this.clients,
                    this.devtools,
                )
            })
        }
    }

    handleDisconnect(client: WebSocket) {
        const { channelId, from } = this.connections.get(client) ?? {}
        if (from === WS_FROM.CLIENT) {
            delete this.clients[channelId]
        } else if (from === WS_FROM.DEVTOOL) {
            delete this.devtools[channelId]
        }
        this.connections.delete(client)
    }
}
