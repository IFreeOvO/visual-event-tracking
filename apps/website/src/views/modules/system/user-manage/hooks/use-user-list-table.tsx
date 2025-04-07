import type { User } from '@/models/vo/user.vo'
import type { ProColumns } from '@ant-design/pro-components'
import { SelectProps, Tag } from 'antd'
import { UserStatusEnum } from '@/constants/enums'
import useListTable from '@/hooks/business/use-list-table'
import MultiSelect from '../components/multi-select'

export type TableDataType = User & {
    showDeletePop: boolean
}

export interface UseUserListTableState {
    roleOptions: SelectProps['options']
}

const useUserListTable = (state: UseUserListTableState) => {
    const { roleOptions } = state
    const customColumns = useMemo(() => {
        const columns: ProColumns<TableDataType>[] = [
            {
                title: 'id',
                dataIndex: 'id',
                align: 'center',
                readonly: true,
            },
            {
                title: '用户名',
                dataIndex: 'username',
                align: 'center',
                ellipsis: true,
                valueType: 'text',
                editable: false,
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                align: 'center',
                width: 200,
                ellipsis: true,
                valueType: 'text',
            },
            {
                title: '用户角色',
                dataIndex: 'roles',
                align: 'center',
                width: 150,
                ellipsis: true,
                valueType: 'select',
                renderText: (_, row) => {
                    if (row.roles.length === 0) {
                        return <span>-</span>
                    }
                    const roles = row.roles?.map((item) => item.roleName).join(',')
                    return roles
                },

                renderFormItem: (item: any) => {
                    const row = item.entity as TableDataType
                    const defaultValue = row?.roles.map((item) => item.id)
                    return (
                        <MultiSelect<number>
                            defaultValue={defaultValue}
                            roleOptions={roleOptions}
                        />
                    )
                },
            },
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                width: 110,
                render: (_, row) => {
                    const color = row.status === UserStatusEnum.Enabled ? 'success' : 'warning'
                    const label = row.status === UserStatusEnum.Enabled ? '启用' : '禁用'
                    return <Tag color={color}>{label}</Tag>
                },
                valueType: 'select',
                valueEnum: {
                    '0': { text: '禁用' },
                    '1': {
                        text: '启用',
                    },
                },
            },
        ]

        return columns
    }, [roleOptions])

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

export default useUserListTable
