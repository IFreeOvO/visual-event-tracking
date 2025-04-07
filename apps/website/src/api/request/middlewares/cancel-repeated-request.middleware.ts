import type { InternalAxiosRequestConfig } from 'axios'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

const requestMap: Map<string, AbortController> = new Map()

const makeKey = (config: InternalAxiosRequestConfig) => {
    return (
        (config.url ?? '') +
        config.method +
        JSON.stringify(config.params) +
        JSON.stringify(config.data)
    )
}

const removeSignal = (config: InternalAxiosRequestConfig) => {
    const key = makeKey(config)
    requestMap.delete(key)
}

const addSignalTo = (config: InternalAxiosRequestConfig) => {
    const controller = new AbortController()
    config.signal = controller.signal

    const key = makeKey(config)
    if (requestMap.has(key)) {
        requestMap.get(key)!.abort()
        requestMap.delete(key)
    } else {
        requestMap.set(key, controller)
    }
}

emitter.on(EmitterEventTypes.onGlobalRequest, (config) => {
    if (!config.signal) {
        addSignalTo(config)
    }
})

emitter.on(EmitterEventTypes.onGlobalFulfilledResponse, (response) => {
    removeSignal(response.config)
})
