export default class SDKMessage {
    event: string = 'SDK'
    data: {
        method: string
        params?: Record<string, any>
    } = { method: '' }

    constructor(method: string, params?: Record<string, any>) {
        this.data.method = method
        if (params) {
            this.data.params = params
        }
    }

    toString(): string {
        return JSON.stringify(this)
    }
}
