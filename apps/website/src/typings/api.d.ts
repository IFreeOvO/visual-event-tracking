declare namespace Api {
    interface commonGetDto<Filter extends Record<string, any> = any> {
        fields?: string[]
        s?: string
        filter?: Filter
        or?: string[]
        sort?: string[]
        join?: string[]
        limit?: number
        offset?: number
        page?: number
        cache?: number
    }

    interface commonGetResp<T> {
        data: T[]
        count: number
        page: number
        pageCount: number
        total: number
    }
}
