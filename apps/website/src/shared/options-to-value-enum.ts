interface Option {
    value: number | string
    label: string
    [key: string]: any
}

/**
 * @description 将select、radio组件的options转成表格里的valueEnum格式
 */
export function optionsToValueEnum(options: Option[]) {
    const valueEnum: Record<number | string, any> = {}
    options.forEach((option) => {
        valueEnum[option.value] = option.label
    })
    return valueEnum
}
