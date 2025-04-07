import type { AxiosError } from 'axios'
import { message } from 'antd'
import { HttpStatusCode } from 'axios'
import { isString } from 'lodash-es'
import { Result } from '@/api/request'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

const handleNetworkError = (err: AxiosError<Result<any>>) => {
    let errMessage = err.message
    const { response } = err
    if (err.name === 'CanceledError') {
        console.error(`'Request ${err.config?.url} canceled'`)
        return
    }
    if (!response) {
        message.open({
            content: '网络出错',
            type: 'error',
        })
        return
    }
    const { status, data } = response
    switch (status) {
        case HttpStatusCode.Conflict:
        case HttpStatusCode.BadRequest:
            if (Array.isArray(data.error)) {
                errMessage = data.error[0]
            } else if (isString(data.error)) {
                errMessage = data.error
            } else {
                errMessage = '请求出错'
            }
            break
        case HttpStatusCode.Unauthorized:
            errMessage = data?.error || '未授权，请重新登录'
            emitter.emit(EmitterEventTypes.onUnAuthorized)
            break
        case HttpStatusCode.Forbidden:
            errMessage = '无访问权限，请联系管理员'
            break
        case HttpStatusCode.NotFound:
            errMessage = data?.error || '接口不存在'
            break
        case HttpStatusCode.MethodNotAllowed:
            errMessage = `不支持${response.config.method}方式请求`
            break
        case HttpStatusCode.RequestTimeout:
            errMessage = '请求超时'
            break
        default:
            if (status >= HttpStatusCode.InternalServerError) {
                errMessage = data?.error || '服务器出错'
            } else {
                errMessage = '请求失败'
            }
    }
    message.open({
        content: errMessage,
        type: 'error',
    })
}

emitter.on(EmitterEventTypes.onGlobalRejectedResponse, (err) => {
    handleNetworkError(err)
})
