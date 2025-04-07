import { debounce } from 'lodash-es'

export class Router {
    routerChangeCallback?: (...args: any) => any

    constructor() {
        this.setupListeners()
    }

    onChange(callback: (...args: any) => any) {
        if (typeof callback === 'function') {
            this.routerChangeCallback = debounce(callback, 100)
        }
    }

    setupListeners() {
        const wrapMethods = ['pushState', 'replaceState'] as const
        wrapMethods.forEach((methodName) => {
            const originalMethod = window.history[methodName]
            window.history[methodName] = (...args: any[]) => {
                originalMethod.apply(window.history, args as any)
                this.routerChangeCallback && this.routerChangeCallback(...args)
            }
        })

        window.addEventListener('popstate', (...args) => {
            this.routerChangeCallback && this.routerChangeCallback(...args)
        })

        window.addEventListener('hashchange', (...args) => {
            this.routerChangeCallback && this.routerChangeCallback(...args)
        })
    }
}
