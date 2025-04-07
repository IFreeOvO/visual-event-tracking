import { objectToSearchParams } from './utils'

export class Request {
    baseURL: string = ''

    constructor(options: { baseURL?: string }) {
        Object.assign(this, options)
    }

    sendRequest(
        method: string,
        route: string,
        data?: Record<string, any>,
        config?: Record<string, any>,
    ): Promise<{
        code: number
        message: string
        data: any
    }> {
        let url = ''
        if (method === 'GET') {
            url = `${this.baseURL}${route}${data ? `?${objectToSearchParams(data)}` : ''}`
        } else {
            url = `${this.baseURL}${route}`
        }

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open(method, url)

            this.setHeaders(xhr, config ? config.headers : {})

            if (config?.signal) {
                config.signal.addEventListener('abort', () => xhr.abort())
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(JSON.parse(xhr.responseText))
                    } else {
                        reject(new Error(`请求失败，状态码：${xhr.status}`))
                    }
                }
            }

            xhr.onerror = (error) => {
                reject(error)
            }

            if (method === 'POST') {
                xhr.send(JSON.stringify(data))
            } else {
                xhr.send()
            }
        })
    }

    setHeaders(xhr: XMLHttpRequest, headers: Record<string, any> = {}) {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        for (const key in headers) {
            xhr.setRequestHeader(key, headers[key])
        }
    }

    post(route: string, data?: Record<string, any>, config?: Record<string, any>) {
        return this.sendRequest('POST', route, data, config)
    }

    get(route: string, data?: Record<string, any>, config?: Record<string, any>) {
        return this.sendRequest('GET', route, data, config)
    }
}
