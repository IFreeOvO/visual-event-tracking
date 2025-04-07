import type { WebSocket } from 'ws'
import { Injectable } from '@nestjs/common'
import { EventType } from '@/shared/constants'

interface Message<T = Record<string, any>> {
    event: string
    data: T
}
interface Protocol {
    id: string
    method?: string
    params?: Record<string, any>
}

@Injectable()
export class RemoteDevtoolService {
    /**
     * @remark 处理客户端发送给chrome-devtool的消息
     */
    handleClientReceived(
        channelId: string,
        message: string,
        clients: Record<string, WebSocket>,
        devtools: Record<string, WebSocket>,
    ) {
        if (message === '{}') {
            return
        }

        const socket = devtools[channelId]
        if (socket) {
            socket.send(message)
        } else {
            console.warn('对应devtool不存在', channelId, Object.keys(devtools))
            clients[channelId].close()
        }
    }

    /**
     * @remark 处理chrome-devtool发送给客户端的消息
     */
    handleDevtoolReceived(
        channelId: string,
        message: string,
        clients: Record<string, WebSocket>,
        devtools: Record<string, WebSocket>,
    ) {
        const protocol: Protocol = JSON.parse(message)
        const msg: Message<Protocol> = {
            event: EventType.CDP,
            data: protocol,
        }
        const socket = clients[channelId]
        if (socket) {
            socket.send(JSON.stringify(msg))
        } else {
            console.warn('对应客户端不存在', channelId, Object.keys(clients))
            devtools[channelId].close()
        }
    }
}
