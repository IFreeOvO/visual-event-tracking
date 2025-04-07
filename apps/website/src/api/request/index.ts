import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import emitter, { EmitterEventTypes } from '@/shared/emitter'
import './middlewares/add-authorization-to-headers.middleware'
import './middlewares/cancel-repeated-request.middleware'
import './middlewares/handle-exceptions.middleware'
import { axiosInstance } from './axios'
import '@/mock'

export enum MethodEnum {
    GET = 'get',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete',
}

export interface Result<T = any> {
    code: number
    message: string | string[]
    data: T
    error?: string
}

export type Response<T = any> = [Error | AxiosError, undefined] | [undefined, Result<T>]

axiosInstance.interceptors.request.use((config) => {
    emitter.emit(EmitterEventTypes.onGlobalRequest, config)
    return config
})

axiosInstance.interceptors.response.use(
    (response: AxiosResponse<Result>) => {
        emitter.emit(EmitterEventTypes.onGlobalFulfilledResponse, response)

        if (response.data.code !== 200) {
            message.open({
                content: response.data.error,
                type: 'error',
            })
            return Promise.reject(response.data)
        }

        return response
    },
    (err: AxiosError<Result<any>>) => {
        emitter.emit(EmitterEventTypes.onGlobalRejectedResponse, err)
        return Promise.reject(err)
    },
)

class Request {
    get<T = any>(
        url: string,
        params?: Record<string, any>,
        config?: AxiosRequestConfig,
    ): Promise<Response<T>> {
        const options = Object.assign(
            {},
            {
                url,
                params,
                method: MethodEnum.GET,
            },
            config,
        )
        return this.request(options)
    }

    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
        const options = Object.assign(
            {},
            {
                url,
                data,
                method: MethodEnum.POST,
            },
            config,
        )
        return this.request(options)
    }

    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
        const options = Object.assign(
            {},
            {
                url,
                data,
                method: MethodEnum.PATCH,
            },
            config,
        )
        return this.request(options)
    }

    delete<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Response<T>> {
        const options = Object.assign(
            {},
            {
                url,
                data,
                method: MethodEnum.DELETE,
            },
            config,
        )
        return this.request(options)
    }

    request<T = any>(config: AxiosRequestConfig): Promise<Response<T>> {
        return new Promise((resolve) => {
            axiosInstance
                .request(config)
                .then((res) => {
                    resolve([undefined, res.data as Result<T>])
                })
                .catch((e: Error | AxiosError) => {
                    resolve([e, undefined])
                })
        })
    }
}

export default new Request()
