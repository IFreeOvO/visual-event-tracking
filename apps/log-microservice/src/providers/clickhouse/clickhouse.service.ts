import { ClickHouseClient, DataFormat } from '@clickhouse/client'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { CLICKHOUSE_PROVIDE_NAME, CLICKHOUSE_TRACK_LOG_TABLE } from '@/constants/global.constant'
import { formatDateValue, isDateRange } from '@/shared/date-utils'

@Injectable()
export class ClickhouseService implements OnModuleInit {
    constructor(@Inject(CLICKHOUSE_PROVIDE_NAME) private clickhouseCLient: ClickHouseClient) {}

    async onModuleInit() {
        await this.initializeClickhouseTables()
    }

    async initializeClickhouseTables() {
        const sql = `
        CREATE TABLE IF NOT EXISTS ${CLICKHOUSE_TRACK_LOG_TABLE}
            (
                id UUID DEFAULT generateUUIDv4(),
                eventId UInt32,
                eventName String,
                eventType UInt8,
                eventTime DateTime64(3, 'Asia/Shanghai'),
                url String,
                xpath String,
                isSiblingEffective UInt8,
                snapshot String,
                projectId UInt32,
                params String,
                createDate DateTime64(3) DEFAULT now64(3, 'Asia/Shanghai')
            )
        ENGINE = MergeTree()
        PARTITION BY toDate(eventTime)
        ORDER BY (eventId, eventTime)`
        await this.clickhouseCLient.command({ query: sql })
    }

    async insert(values: Record<string, any>[], format: DataFormat = 'JSONEachRow') {
        return await this.clickhouseCLient.insert({
            table: CLICKHOUSE_TRACK_LOG_TABLE,
            values: values,
            format,
        })
    }

    async dropTable() {
        return await this.clickhouseCLient.command({
            query: `DROP TABLE IF EXISTS ${CLICKHOUSE_TRACK_LOG_TABLE}`,
        })
    }

    async selectTable(format: DataFormat = 'JSONEachRow') {
        const rows = await this.clickhouseCLient.query({
            query: `SELECT * FROM ${CLICKHOUSE_TRACK_LOG_TABLE}`,
            format,
        })
        const json = await rows.json()
        return json
    }

    /**
     * 分页查询 ClickHouse 数据
     * @param page 页码，从1开始
     * @param limit 每页记录数
     * @param sort 排序字段，默认按事件时间降序
     * @param filter 过滤条件对象
     * @returns 分页数据和总记录数
     */
    async queryWithPagination(
        table: string,
        page: number = 1,
        limit: number = 10,
        filter: Record<string, any> = {},
        sort: string = 'eventTime DESC',
    ) {
        // 构建WHERE子句
        const filterConditions = this.getFilterConditions(filter)
        let where = ''
        if (filterConditions.length > 0) {
            where = `WHERE ${filterConditions.join(' AND ')}`
        }
        const offset = (page - 1) * limit

        // 构建查询语句
        const dataQuery = `
            SELECT *
            FROM ${table}
            ${where}
            ORDER BY ${sort}
            LIMIT ${limit}
            OFFSET ${offset}
        `
        // 构建计数查询语句
        const countQuery = `
            SELECT count() as total
            FROM ${table}
            ${where}
        `

        // 执行查询
        const dataResult = await this.clickhouseCLient.query({
            query: dataQuery,
            format: 'JSONEachRow',
        })
        const countResult = await this.clickhouseCLient.query({
            query: countQuery,
            format: 'JSONEachRow',
        })

        // 解析结果
        const data = await dataResult.json()
        const countJson = await countResult.json<{ total: number }>()
        const total = Number(countJson[0]?.total || 0)

        return {
            data,
            page: Number(page),
            count: data.length,
            total: total,
            pageCount: Math.ceil(total / limit),
        }
    }

    getFilterConditions(filter: Record<string, any>) {
        const filterConditions = []
        for (const [key, value] of Object.entries(filter)) {
            if (value !== undefined && value !== null) {
                // 根据字段类型处理不同类型的值
                if (typeof value === 'number' || typeof value === 'boolean') {
                    // 数字或布尔类型使用等于
                    filterConditions.push(`${key} = ${value}`)
                } else if (typeof value === 'string') {
                    // 字符串类型使用LIKE
                    filterConditions.push(`${key} LIKE '%${value}%'`)
                } else if (value instanceof Date) {
                    // 日期类型
                    filterConditions.push(`${key} = '${value.toISOString()}'`)
                } else if (Array.isArray(value) && value.length === 2) {
                    // 检查是否为日期范围查询
                    const isValid = isDateRange(value)
                    if (isValid) {
                        // 日期范围查询
                        const startDate = formatDateValue(value[0])
                        const endDate = formatDateValue(value[1])
                        filterConditions.push(`${key} BETWEEN '${startDate}' AND '${endDate}'`)
                    } else {
                        // 普通数组，使用IN操作符
                        filterConditions.push(`${key} IN (${value.join(',')})`)
                    }
                }
            }
        }
        return filterConditions
    }
}
