import type { Dependency } from '@/types'
import { DEPS_METADATA } from '@/shared/constants'
import container from '@/shared/container'

// 无需手动实例化，也能自动注册模块
export function Module(): ClassDecorator {
    return function (target: any) {
        const newTarget = new Proxy(target, {
            construct(originTarget, args) {
                const dependencies: Dependency[] =
                    Reflect.getMetadata(DEPS_METADATA, originTarget.prototype) || []
                dependencies.forEach((dep) => {
                    const { token, propertyName } = dep
                    const instance = container.get(token)
                    Reflect.defineProperty(originTarget.prototype, propertyName, {
                        value: instance,
                    })
                })

                return new originTarget(...args)
            },
        })

        return newTarget
    }
}

export function Inject({
    constructorArgs = [], // 指定构造函数的参数。预留给以后的同类型的不同实例，自动注入场景。比如DomInspector依赖的Socket，就可以通过自己传参。
    identifier,
    provider,
}: {
    identifier?: string // 允许手动传入模块标识。适合手动往容器里注册模块的场景。例如本项目Socket是手动注册，后续DomInspector自动注入时，就可以方便找到已经手动注册的Socket
    constructorArgs?: any[]
    provider?: any
} = {}): PropertyDecorator {
    return function (targetPrototype: any, propertyName) {
        const definition = Reflect.getMetadata('design:type', targetPrototype, propertyName)
        const token = identifier ?? definition.name // 标识符

        // provider存在。直接根据provider从依赖容器里取出值注入
        if (provider) {
            Reflect.defineProperty(targetPrototype, propertyName, {
                value: container.get(provider),
            })
            return
        }

        const currentDep: Dependency = {
            token,
            propertyName,
        }
        let dependencies: Dependency[] = Reflect.getMetadata(DEPS_METADATA, targetPrototype) || []
        dependencies = [...dependencies, currentDep]
        Reflect.defineMetadata(DEPS_METADATA, dependencies, targetPrototype)
        container.register(token, {
            definition,
            constructorArgs,
        })
    }
}
