import type { Action } from '@/models/vo/action.vo'
import type { ProColumns } from '@ant-design/pro-components'
import useListTable from '@/hooks/business/use-list-table'

export type TableDataType = Action & {
    showDeletePop: boolean
}

const useActionListTable = () => {
    const [customColumns] = useImmer<ProColumns<TableDataType>[]>([
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            readonly: true,
        },
        {
            title: '行为名称',
            dataIndex: 'actionName',
            align: 'center',
            ellipsis: true,
            valueType: 'text',
            editable: false,
        },
        {
            title: '行为描述',
            dataIndex: 'actionDesc',
            align: 'center',
            width: 200,
            ellipsis: true,
            valueType: 'text',
        },
    ])

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

export default useActionListTable
