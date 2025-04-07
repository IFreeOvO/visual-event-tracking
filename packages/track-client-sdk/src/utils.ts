import type { Datasource } from './type.d.ts'

const svgTags = [
    'svg',
    'path',
    'g',
    'image',
    'text',
    'line',
    'rect',
    'polygon',
    'circle',
    'ellipse',
]

export function findIndex(ele: Element | null, currentTag: string) {
    let nth = 0
    while (ele) {
        if (ele.nodeName.toLowerCase() === currentTag) nth += 1
        ele = ele.previousElementSibling
    }
    return nth
}

// 获取元素标签名
export function getTagName(ele: Element) {
    const tag = ele.tagName.toLowerCase()
    if (svgTags.indexOf(tag) !== -1) {
        return `*[name()='${tag}']`
    }
    return tag
}

export function getXpath(ele: Element | null) {
    let cur = ele
    const path = []

    while (cur) {
        const currentTag = cur.nodeName.toLowerCase()
        const nth = findIndex(cur, currentTag)
        path.push(`${getTagName(cur)}[${nth}]`)
        cur = cur.parentElement
    }

    return `/${path.reverse().join('/')}`
}

export function getEleByXpath(xpath: string) {
    const doc = document
    const result = doc.evaluate(xpath, doc)
    const item = result.iterateNext()
    return item as Element | null
}

// 根据所有兄弟元素的tag、id和class生成唯一标记(减少在目标元素相邻位置插入相同tag，导致xpath命中误判的情况)
export function getValidationMarker(ele: Element) {
    // 获取父节点的所有子元素
    const siblings = Array.from(ele.parentNode?.children || [])

    // 创建拼接字符串的数组
    const result = siblings.map((sibling) => {
        const tagName = sibling.tagName.toLowerCase()
        const id = sibling.id ? `#${sibling.id}` : ''
        const classList = sibling.className ? `.${sibling.className.split(' ').join('.')}` : ''
        return `${tagName}[${id}${classList}]`
    })
    return result.join('|')
}

// 将对象转换为查询参数
export function objectToSearchParams(data: Record<string, any>) {
    const paramsArray = []
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            let value = data[key]
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value)
            }
            paramsArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        }
    }
    return paramsArray.join('&')
}

export function isSiblingByXpath(xpath: string, targetXpath: string) {
    const isSameParentXPath =
        xpath.substring(0, xpath.lastIndexOf('/')) ===
        targetXpath.substring(0, targetXpath.lastIndexOf('/'))
    if (!isSameParentXPath) {
        return false
    }
    return hasSameClassList(
        getEleByXpath(xpath) ?? undefined,
        getEleByXpath(targetXpath) ?? undefined,
    )
}

// 生成兄弟元素的datasource配置
export function getSiblingDatasource(
    datasource: Datasource[],
    originXpath: string,
    currentXpath: string,
) {
    // 列表元素触发埋点时，如果datasource的xpath和元素的xpath是包含关系，说明是在当前元素内部查找数据源。
    const newDatasource = datasource.map((row) => {
        const newRow = { ...row }
        // 比如埋点配置里xpath为div[1]/div[2]，配的datasource里有为div[1]/div[2]/span[1]，去掉它们的公共部分，得到span[1]
        // 当它的兄弟元素为div[1]/div[3]， 触发埋点时，查找的datasource应该为div[1]/div[3]/span[1]。也就是兄弟的xpath加上上面的公共部分span[1]
        if (row.fieldXpath.startsWith(originXpath)) {
            newRow.fieldXpath = row.fieldXpath.replace(originXpath, currentXpath)
        }
        return newRow
    })
    return newDatasource
}

// 获取兄弟元素的xpath
export function getSiblingXpath(xpath: string, i: number) {
    return xpath.substring(0, xpath.lastIndexOf('[')) + `[${i + 1}]`
}

// 两个元素类名是否相同
export function hasSameClassList(ele1?: Element, ele2?: Element) {
    const classList1 = Array.from(ele1?.classList ?? []).join(',')
    const classList2 = Array.from(ele2?.classList ?? []).join(',')
    return classList1 === classList2
}
