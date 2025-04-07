import type { SendIframeInfoParams, SDKConfig } from '@/types'
import PostMessage from '@/post-message'
import {
    EmitEvents,
    EventMethods,
    EventType,
    GLOBAL_PROVIDERS,
    RouterMethods,
} from '@/shared/constants'
import { Inject, Module } from '@/shared/decorator'
import Emitter from '@/shared/emitter'

@Module()
class BrowserHistory {
    @Inject({
        provider: GLOBAL_PROVIDERS.SDKConfig,
    })
    SDKConfig?: SDKConfig

    @Inject()
    postMessage?: PostMessage

    lastPagePosition: number = 0

    /**
     * 阻止事件监听触发
     */
    stopEvent: boolean = false

    constructor() {
        this.lastPagePosition = getPageIndex(history)
        this.sendIframeInfo()
        this.syncURL()

        Emitter.on(EmitEvents.RequestForward, this.handleRequestForward.bind(this))
        Emitter.on(EmitEvents.RequestBack, this.handleRequestBack.bind(this))
        Emitter.on(EmitEvents.RequestRefresh, this.handleRequestRefresh.bind(this))
    }

    handleRequestRefresh() {
        location.reload()
    }

    handleRequestForward() {
        this.stopEvent = true
        // @ts-expect-error 这里的go是包装过的,传多个参数不用报错
        history.go(1, true)
    }

    handleRequestBack() {
        this.stopEvent = true
        // @ts-expect-error 这里的go是包装过的,传多个参数不用报错
        history.go(-1, true)
    }

    setupListeners() {
        this.wrapHistory()

        window.addEventListener(RouterMethods.Popstate, (e) => {
            this.handleURLChange(RouterMethods.Popstate, e)
        })

        window.addEventListener(RouterMethods.Hashchange, (e) => {
            this.handleURLChange(RouterMethods.Hashchange, e)
        })
    }

    wrapHistory() {
        const wrapMethods: Array<keyof History> = [
            'pushState',
            'replaceState',
            'go',
            'forward',
            'back',
        ]
        wrapMethods.forEach((methodName) => {
            const originalMethod = window.history[methodName]
            // @ts-expect-error history这里报只读属性错误
            window.history[methodName] = (...args: any[]) => {
                // 埋点项目触发iframe的go，需要阻止监听。sdk自己执行的history，解除阻止监听的限制
                if (methodName === 'go' && args[1] === true) {
                    this.stopEvent = true
                } else {
                    this.stopEvent = false
                }
                this.handleURLChange(methodName as RouterMethods, args)
                originalMethod.apply(window.history, args)
            }
        })
    }

    sendIframeInfo() {
        this.postMessage?.send<SendIframeInfoParams>({
            type: EventType.History,
            method: EventMethods.SendIframeInfoParams,
            params: {
                fullPath: location.href,
                origin: location.origin,
            },
        })
    }

    /**
     * 同步iframe地址给埋点项目
     *  特殊情况，iframe可能会重定向。比如地址输入http://localhost:5100，hash路由会重定向http://localhost:5100/#/
     */
    syncURL() {
        requestAnimationFrame(() => {
            this.postMessage?.send({
                type: EventType.History,
                method: EventMethods.SyncURL,
                params: {
                    fullPath: location.href,
                },
            })
        })
    }

    // TODO: 该方案在低版本router上还未验证可行性
    handleURLChange(method: RouterMethods, e: any) {
        this.syncURL()

        // 不同框架、不同版本的router的实现方案不一样(比如vue-router 3.0以后版本。hash模式也是使用pushState跳转路由，用hashchange是无法监听的)。所以要支持用户自定义监听方案
        if (this.SDKConfig?.router?.routerHandler) {
            this.SDKConfig.router.routerHandler(method, e, {
                forward: this.forward,
                replace: this.replace,
                popstate: this.popstate,
            })
            return
        }

        // 阻止埋点项目发来的前进和后退，触发的监听
        if (this.stopEvent === true) {
            return
        }

        // 默认按vue和react新版路由实现,简单监听一下
        if (method === RouterMethods.PushState) {
            this.forward(e)
        } else if (method === RouterMethods.ReplaceState) {
            this.replace(e)
        }
        // 触发Popstate可以是前进也可能是后退
        else if (method === RouterMethods.Popstate) {
            this.popstate()
        }
    }

    forward(e: any) {
        const [, , path] = e
        this.postMessage?.send({
            type: EventType.History,
            method: EventMethods.Forward,
            params: {
                path,
            },
        })
        this.updateLastPagePosition()
    }

    replace(e: any) {
        const [, , path] = e
        this.postMessage?.send({
            type: EventType.History,
            method: EventMethods.Replace,
            params: {
                path,
            },
        })
    }

    popstate() {
        const currentPosition = getPageIndex(history)
        this.postMessage?.send({
            type: EventType.History,
            method: EventMethods.Popstate,
            params: {
                delta: currentPosition - this.lastPagePosition,
            },
        })
        this.updateLastPagePosition()
    }

    updateLastPagePosition() {
        requestAnimationFrame(() => {
            const currentPosition = getPageIndex(history)
            this.lastPagePosition = currentPosition
        })
    }
}

export default BrowserHistory

// 获取页面在历史堆栈里的位置。position是vue-router里的，idx是react-router里的
function getPageIndex(history: { state: { idx?: number; position?: number } }) {
    const { state } = history
    return state.position ?? state.idx ?? 0
}
