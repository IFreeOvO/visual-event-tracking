import { getToken } from '@/shared/auth'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

emitter.on(EmitterEventTypes.onGlobalRequest, (config) => {
    config.headers.Authorization = getToken()
    return config
})
