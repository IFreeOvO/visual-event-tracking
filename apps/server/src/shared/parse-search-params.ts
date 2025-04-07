// 解析路由参数，例如/path?a=1&b=1,返回{a:1,b:1}
export function parseSearchParams(fullPath: string) {
    const [, urlSearchParams] = fullPath.split('?')
    if (!urlSearchParams) {
        return
    }
    const paramsArr = urlSearchParams.split('&')
    const params = paramsArr.reduce(
        (res, param) => {
            const [key, value] = param.split('=')
            if (key) {
                res[key] = value
            }
            return res
        },
        {} as Record<string, string>,
    )
    return params
}
