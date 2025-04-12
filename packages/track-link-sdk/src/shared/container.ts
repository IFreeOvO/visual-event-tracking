import type { AnyClass, Provider } from '@/types'

class Container {
    private _providerMap: Map<string, Provider> = new Map()

    private _modulesMap: Map<string, AnyClass> = new Map()

    register(token: string, provider: Provider) {
        this._providerMap.set(token, provider)
    }

    get<T = any>(token: string): T {
        let value
        if (this._modulesMap.has(token)) {
            value = this._modulesMap.get(token)
        } else {
            const provider = this._providerMap.get(token)

            if (provider) {
                // 如果是类，先实例化再存储
                if (typeof provider === 'object' && provider.definition) {
                    const { definition, constructorArgs } = provider
                    value = new definition(...constructorArgs)
                    this._modulesMap.set(token, value)
                } else {
                    value = this._providerMap.get(token)
                }
            } else {
                throw new Error(`module not found: ${token}`)
            }
        }
        return value
    }
}

export default new Container()
