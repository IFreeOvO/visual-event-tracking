import type { PostMessageData, ReceiveTrackingDataParams } from './types'
import type { DOMDomain } from '@/cdp/domain/domain-type'
import html2canvas from 'html2canvas'
import isMobile from 'ismobilejs'
import { EmitEvents, EventMethods, EventType, Overlay } from '@/shared/constants'
import { Module, Inject } from '@/shared/decorator'
import Emitter from '@/shared/emitter'
import HD from '@/shared/highlight'
import { throttle } from '@/shared/util'
import { getValidationMarker, getXpath } from '@/shared/xpath-utils'
import PostMessage from './post-message'
import Socket from './socket'

enum InspectorStatus {
    'enable' = 'enable',
    'disable' = 'disable',
}

@Module()
class DomInspector {
    isMobile: boolean

    root: Window | Element | Document

    _moveEvent: string

    _handleMove: (e: Event) => void

    _handleClick: (e: Event) => void

    @Inject()
    socket?: Socket

    @Inject()
    postMessage?: PostMessage

    status: InspectorStatus = InspectorStatus.disable

    DOMDomain?: DOMDomain

    eventMap: {
        [key: string]: {
            dom: Window | Element | Document
            listener: (e: Event) => void
            options: { capture?: boolean; passive?: boolean }
        }
    } = {}

    constructor() {
        this.socket?.bootstrap()
        // TODO: 移动端场景，未验证
        this.isMobile = isMobile(window.navigator.userAgent).any
        this.root = document
        this._moveEvent = this.isMobile ? 'touchmove' : 'mousemove'
        this._handleMove = throttle(this._move)
        this._handleClick = throttle(this._clickListener)

        Emitter.on(EmitEvents.RequestEnableInspect, this.enable.bind(this))
        Emitter.on(EmitEvents.RequestDisableInspect, this.disable.bind(this))
    }

    private _move(e: Event) {
        if (!this.socket?.cdp?.DOM) {
            return
        }
        const DOMDomain = this.socket.cdp.DOM

        if (!e.target) {
            return
        }

        HD.highlight(e.target)
        const { nodeId } = DOMDomain.getDOMNodeId({
            node: e.target as Node,
        })
        const msg = {
            method: Overlay.NodeHighlightRequested,
            params: {
                nodeId,
            },
        }
        this.socket.send(JSON.stringify(msg))
    }

    private _closeHighlight() {
        HD.clearOverlayCache()
        HD.reset()
    }

    private _scrollListener() {
        this._closeHighlight()
    }

    private _resizeListener() {
        this._closeHighlight()
    }

    private _registerEvent(
        dom: Element | Window | Document,
        eventName: string,
        listener: (e: Event) => void,
        options: {
            capture?: boolean
            passive?: boolean
        } = { capture: true, passive: true },
    ) {
        this.eventMap[eventName] = {
            dom,
            listener: listener.bind(this),
            options,
        }
        dom.addEventListener(eventName, this.eventMap[eventName].listener, options)
    }

    private _startListening() {
        this._registerEvent(window, 'resize', this._resizeListener)
        this._registerEvent(this.root, 'scroll', this._scrollListener)
        this._registerEvent(this.root, 'click', this._handleClick, {
            passive: false,
            capture: true,
        })
        this._registerEvent(this.root, this._moveEvent, this._handleMove)
    }

    private _stopListening() {
        Object.keys(this.eventMap).forEach((key) => {
            this.eventMap[key].dom.removeEventListener(
                key,
                this.eventMap[key].listener,
                this.eventMap[key].options,
            )
            delete this.eventMap[key]
        })
    }

    private async _clickListener(
        e: Event & { nativeEvent?: { stopImmediatePropagation: () => void } },
    ) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const prepareMsg: PostMessageData<ReceiveTrackingDataParams> = {
            type: EventType.SDK,
            method: EventMethods.BeforeReceiveData,
        }
        this.postMessage?.send(prepareMsg)

        const ele = e.target as Element
        const snapshotBlob = await captureElementAsBlob(document.querySelector('html')!)
        const msg: PostMessageData<ReceiveTrackingDataParams> = {
            type: EventType.SDK,
            method: EventMethods.ReceiveTrackingData,
            params: {
                xpath: getXpath(ele),
                snapshotBlob,
                validationMarker: getValidationMarker(ele),
            },
        }
        this.postMessage?.send(msg)
    }

    enable() {
        if (this.status === InspectorStatus.enable) {
            return
        }
        this.status = InspectorStatus.enable
        this._startListening()
    }

    disable() {
        if (this.status === InspectorStatus.disable) {
            return
        }

        this.status = InspectorStatus.disable
        this._closeHighlight()
        this._stopListening()
    }
}

export default DomInspector

// 截取快照
async function captureElementAsBlob(ele: Element) {
    const canvas = await html2canvas(ele as HTMLElement, {
        useCORS: true,
        allowTaint: true,
    })
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(function (blob) {
            if (blob) {
                // 在这里处理生成的 Blob 对象
                resolve(blob)
            } else {
                reject(new Error('Failed to create Blob from canvas.'))
            }
        }, 'image/png')
    })
}
