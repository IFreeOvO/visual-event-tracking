import type { Feature } from '@/models/vo/feature.vo'
import type { ProColumns } from '@ant-design/pro-components'
import useListTable from '@/hooks/business/use-list-table'

export type TableDataType = Feature & {
    showDeletePop: boolean
}

const useFeatureListTable = () => {
    const customColumns = useMemo<ProColumns<TableDataType>[]>(() => {
        const columns: ProColumns<TableDataType>[] = [
            {
                title: 'id',
                dataIndex: 'id',
                align: 'center',
                readonly: true,
                width: 60,
            },
            {
                title: '功能',
                dataIndex: 'subjectName',
                align: 'center',
                ellipsis: true,
                valueType: 'text',
                editable: false,
            },
            {
                title: '功能编码',
                dataIndex: 'subjectCode',
                align: 'center',
                ellipsis: true,
                valueType: 'text',
                editable: false,
            },
            {
                title: '功能描述',
                dataIndex: 'subjectDesc',
                align: 'center',
                width: 200,
                ellipsis: true,
                valueType: 'text',
            },
            {
                title: '支持行为',
                dataIndex: 'action',
                align: 'center',
                editable: false,

                renderText: (_, row) => {
                    return row.action.actionDesc
                },
            },
        ]
        return columns
    }, [])

    const {
        toolButtons,
        tableProps,
        columns,
        tableData,
        isLoading,
        page,
        pageSize,
        paginationTotal,
        setPageSize,
        setPage,
        setPaginationTotal,
        toggleLoading,
        onToolButtonClick,
        setTableData,
    } = useListTable<TableDataType>({
        customColumns,
    })

    return {
        page,
        pageSize,
        paginationTotal,
        toolButtons,
        tableProps,
        columns,
        tableData,
        isLoading,
        setPageSize,
        setPage,
        setPaginationTotal,
        toggleLoading,
        onToolButtonClick,
        setTableData,
    }
}

export default useFeatureListTable
