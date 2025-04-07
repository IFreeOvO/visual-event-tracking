import type { PostMessageData } from './types'
import { EventType, GLOBAL_PROVIDERS, EventMethods, EmitEvents } from '@/shared/constants'
import { Inject, Module } from '@/shared/decorator'
import Emitter from './shared/emitter'
import Socket from './socket'

@Module()
class PostMessage {
    @Inject({
        provider: GLOBAL_PROVIDERS.TrackingClientURL,
    })
    targetOrigin?: string

    @Inject()
    socket?: Socket

    constructor() {
        this._registerMessageEvent()
    }

    private _registerMessageEvent() {
        window.addEventListener('message', (e) => {
            if (e.origin === this.targetOrigin) {
                this._handleMessage(e.data)
            }
        })
    }

    // 处理埋点项目发来的消息
    private _handleMessage(data: PostMessageData) {
        const { method, type } = data
        if (type === EventType.History) {
            switch (method) {
                case EventMethods.RequestForward:
                    Emitter.emit(EmitEvents.RequestForward)
                    break
                case EventMethods.RequestBack:
                    Emitter.emit(EmitEvents.RequestBack)
                    break
                case EventMethods.RequestRefresh:
                    Emitter.emit(EmitEvents.RequestRefresh)
                    break
            }
        } else if (type === EventType.SDK) {
            switch (method) {
                case EventMethods.EnableInspect:
                    Emitter.emit(EmitEvents.RequestEnableInspect)
                    break
                case EventMethods.DisableInspect:
                    Emitter.emit(EmitEvents.RequestDisableInspect)
                    break
            }
        }
    }

    send<Data = Record<string, any>>(msg: PostMessageData<Data>) {
        window.parent.postMessage(msg, normalizeURL(this.targetOrigin ?? ''))
    }
}

export default PostMessage

function normalizeURL(url: string) {
    return new URL(url).origin
}
