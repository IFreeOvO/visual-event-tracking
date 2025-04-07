import type { TrackLog } from '@/models/vo/tracking.vo'
import type { EditableProTableProps, ProColumns } from '@ant-design/pro-components'
import { useDebounce, useSize, useToggle } from 'ahooks'
import { Image } from 'antd'
import usePagination from '@/hooks/business/use-pagination'
import { EDITABLE_TABLE_ID } from '@/layouts/form-and-table-layout'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

export interface LogTableData extends Omit<TrackLog, 'eventTime' | 'eventType'> {
    eventTime: string
    eventType: string
}

const useLogListTable = () => {
    const [columns] = useImmer<ProColumns<LogTableData>[]>([
        {
            title: '发生时间',
            dataIndex: 'eventTime',
            align: 'center',
        },
        {
            title: '事件名称',
            dataIndex: 'eventName',
            align: 'center',
        },
        {
            title: '事件类型',
            dataIndex: 'eventType',
            align: 'center',
            width: 100,
            ellipsis: true,
        },
        {
            title: '埋点xpath',
            dataIndex: 'xpath',
            align: 'center',
            width: 160,
            ellipsis: true,
        },
        {
            title: '埋点参数',
            dataIndex: 'params',
            align: 'center',
        },
        {
            title: '页面地址',
            dataIndex: 'url',
            align: 'center',
        },
        {
            title: '原埋点快照',
            dataIndex: 'snapshot',
            align: 'center',
            render: (_value, record) => <Image src={record.snapshot} width={50}></Image>,
        },
    ])

    const {
        pageSizeOptions,
        paginationTotal,
        page,
        pageSize,
        showTotal,
        setPaginationTotal,
        setPage,
        setPageSize,
    } = usePagination()
    const [isLoading, { toggle: toggleLoading }] = useToggle()
    const [tableData, setTableData] = useImmer<LogTableData[]>([])
    const editTableDom = document.querySelector(`#${EDITABLE_TABLE_ID}`)
    const tableSize = useSize(editTableDom)
    const debounceTableSize = useDebounce(tableSize, { wait: 200 })
    const rowKey = 'id'

    const tableProps = useMemo(() => {
        const paginationHeight = 42 // 这里多给2像素，为了让pagination显示完整
        const tableHeader = document.querySelector('.ant-table-thead')
        const tableHeaderHeight = tableHeader?.clientHeight ?? 0
        const scrollY = debounceTableSize?.height
            ? debounceTableSize?.height - tableHeaderHeight - paginationHeight
            : 0
        const tableProps: EditableProTableProps<LogTableData, any> = {
            scroll: {
                y: scrollY,
            },
            loading: isLoading,
            rowKey,
            pagination: {
                current: page,
                pageSize,
                total: paginationTotal,
                showSizeChanger: true,
                pageSizeOptions,
                showTotal,
                onChange: (page, pageSize) => {
                    emitter.emit(EmitterEventTypes.onPaginationChange, [page, pageSize])
                },
            },
            recordCreatorProps: false,
        }
        return tableProps
    }, [isLoading, page, pageSize, debounceTableSize, paginationTotal, pageSizeOptions, showTotal])

    return {
        page,
        pageSize,
        paginationTotal,
        tableProps,
        columns,
        tableData,
        isLoading,
        setPageSize,
        setPage,
        setPaginationTotal,
        toggleLoading,
        setTableData,
    }
}

export default useLogListTable
