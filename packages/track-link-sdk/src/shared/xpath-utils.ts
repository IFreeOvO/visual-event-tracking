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

// 获取svg的xpath标签名
function getTagName(ele: Element) {
    const tag = ele.tagName.toLowerCase()
    if (svgTags.indexOf(tag) !== -1) {
        return `*[name()='${tag}']`
    }
    return tag
}

export function getXpath(ele: Element): string {
    let cur: Element | null = ele
    const path: string[] = []

    while (cur) {
        const currentTag: string = cur.nodeName.toLowerCase()
        const nth: number = findIndex(cur, currentTag)
        path.push(`${getTagName(cur)}[${nth}]`)
        cur = cur.parentElement
    }

    return `/${path.reverse().join('/')}`
}

// 查找同级元素中的索引
export function findIndex(ele: Element | null, currentTag: string): number {
    let nth = 0
    while (ele) {
        if (ele.nodeName.toLowerCase() === currentTag) nth += 1
        ele = ele.previousElementSibling
    }
    return nth
}

// 根据所有兄弟元素的tag、id和class生成唯一标记(减少在目标元素相邻位置插入相同tag，或者当前位置被替换成其他组件，导致xpath命中误判的情况)
export function getValidationMarker(ele: Element) {
    if (!ele.parentNode) {
        return ''
    }
    const siblings = Array.from(ele.parentNode.children)

    const result = siblings.map((sibling) => {
        const tagName = sibling.tagName.toLowerCase()
        const id = sibling.id ? `#${sibling.id}` : ''
        const classList = sibling.className ? `.${sibling.className.split(' ').join('.')}` : ''
        return `${tagName}[${id}${classList}]`
    })
    return result.join('|')
}
