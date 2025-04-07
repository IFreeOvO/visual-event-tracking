import type { SDKConfig } from './types'
import { GLOBAL_PROVIDERS } from '@/shared/constants'
import container from '@/shared/container'
export default class TrackLinkSDK {
    static async init(options: SDKConfig) {
        container.register(GLOBAL_PROVIDERS.TrackingClientURL, options.trackingClientURL)
        container.register(GLOBAL_PROVIDERS.SocketConfig, options.socket ?? {})
        container.register(GLOBAL_PROVIDERS.SDKConfig, options)
        this.bindHistoryListeners()
        if (options.socket?.devtoolURL) {
            this.createDomInspector()
        }
    }

    static async createDomInspector() {
        const DomInspector = (await import('./dom-inspector')).default
        new DomInspector()
    }

    // 监听路由变化
    static async bindHistoryListeners() {
        const BrowserHistory = (await import('./browser-history')).default
        const browserHistory = new BrowserHistory()
        browserHistory.setupListeners()
    }
}
