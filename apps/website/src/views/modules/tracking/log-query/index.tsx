import type { LogTableData } from './hooks/use-log-list-table'
import type { SearchLogForm } from '@/models/vo/tracking.vo'
import { useMemoizedFn, useMount } from 'ahooks'
import dayjs from 'dayjs'
import { assign, cloneDeep } from 'lodash-es'
import { getLogList } from '@/api/service/tracking'
import { EventTypeEnum } from '@/constants/enums'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import useLogListTable from './hooks/use-log-list-table'
import useLogSearchForm from './hooks/use-log-search-form'

const LogQuery = () => {
    const { formData, formProps, formItems, searchForm, setFormData } = useLogSearchForm()
    const {
        tableProps,
        columns,
        tableData,
        page,
        pageSize,
        toggleLoading,
        setTableData,
        setPageSize,
        setPage,
        setPaginationTotal,
    } = useLogListTable()

    const queryList = useMemoizedFn(async (params: Parameters<typeof getLogList>[0]) => {
        toggleLoading()
        const [err, res] = await getLogList({
            ...params,
        })

        if (err) {
            toggleLoading()
            return
        }

        const data = res.data.data
        const tableDataSource: LogTableData[] = data.map((item) => {
            return {
                ...item,
                eventTime: dayjs(item.eventTime).format('YYYY-MM-DD HH:mm:ss'),
                eventType: item.eventType === EventTypeEnum.Click ? '点击' : '曝光',
            }
        })

        setTableData(tableDataSource)
        setPaginationTotal(res.data.total)
        toggleLoading()
    })

    const onSearchFinish = (values: SearchLogForm) => {
        const params = cloneDeep(values)
        if (params.eventTime) {
            params.eventTime[0] = dayjs(params.eventTime[0]).format('YYYY-MM-DD HH:mm:ss')
            params.eventTime[1] = dayjs(params.eventTime[1]).format('YYYY-MM-DD HH:mm:ss')
        }
        setPage(1)
        setFormData((draft) => {
            assign(draft, params)
            queryList({
                page: 1,
                limit: pageSize,
                filter: params,
            })
        })
    }

    const onRefresh = () => {
        queryList({
            page,
            limit: pageSize,
            filter: formData,
        })
    }

    const onPaginationChange = ([page, pageSize]: [page: number, pageSize: number]) => {
        setPage(page)
        setPageSize(pageSize)
        queryList({
            page,
            limit: pageSize,
            filter: formData,
        })
    }

    useEmitterListener(EmitterEventTypes.onSearchFinish, onSearchFinish)
    useEmitterListener(EmitterEventTypes.onRefreshTable, onRefresh)
    useEmitterListener(EmitterEventTypes.onPaginationChange, onPaginationChange)

    useMount(() => {
        queryList({
            page,
            limit: pageSize,
            filter: formData,
        })
    })

    return (
        <>
            <FormAndTableLayout<LogTableData, SearchLogForm>
                title="日志列表"
                toolButtons={[]}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
        </>
    )
}

export default LogQuery
