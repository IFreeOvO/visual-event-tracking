import { GetManyDefaultResponse } from '@nestjsx/crud'

// 通用crud查询接口返回格式(因为前端不穿limit，curd的data里不会返回pageCount,total等字段。所以要改成统一都返回)
export function normalizedQueryResult<T>(
    queryResult: GetManyDefaultResponse<T> | T[],
): GetManyDefaultResponse<T> {
    if (Array.isArray(queryResult)) {
        return {
            data: queryResult ?? [],
            page: 1,
            pageCount: 1,
            count: queryResult.length,
            total: queryResult.length,
        }
    } else {
        return queryResult
    }
}
