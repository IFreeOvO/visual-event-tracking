import dayjs from 'dayjs'

/**
 * @description 判断数组中的值是否为日期范围
 * @example
 * isDateRange(['2021-01-01', '2021-01-02']) // true
 * isDateRange([1 , 2]) // false
 */
export function isDateRange(values: any[]): boolean {
    if (!Array.isArray(values) || values.length !== 2) return false

    // 检查值是否为日期字符串或Date对象
    return values.every((value) => {
        return dayjs(value).isValid()
    })
}

/**
 * @description 格式化日期值为ClickHouse兼容格式
 * @example
 * formatDateValue('2021-01-01') // '2021-01-01 00:00:00'
 */
export function formatDateValue(value: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string {
    return dayjs(value).format(format)
}
