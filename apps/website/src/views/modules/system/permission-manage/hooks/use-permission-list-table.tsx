import type { Permission } from '@/models/vo/permission.vo'
import type { ProColumns } from '@ant-design/pro-components'
import { Tag } from 'antd'
import { PermissionStatusEnum, PermissionTypeEnum } from '@/constants/enums'
import useListTable from '@/hooks/business/use-list-table'

export type TableDataType = Permission & {
    showDeletePop: boolean
}

const usePermissionListTable = () => {
    const [customColumns] = useImmer<ProColumns<TableDataType>[]>([
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            width: 80,
            readonly: true,
        },
        {
            title: '权限编码',
            dataIndex: 'permissionCode',
            align: 'center',
            ellipsis: true,
            valueType: 'text',
            editable: false,
        },
        {
            title: '权限类型',
            dataIndex: 'permissionType',
            align: 'center',
            width: 110,
            editable: false,
            render: (_, row) => {
                const color = row.permissionType === PermissionTypeEnum.Api ? 'cyan' : 'geekblue'
                const label = row.permissionType === PermissionTypeEnum.Api ? '接口' : '菜单'
                return <Tag color={color}>{label}</Tag>
            },
        },
        {
            title: '关联',
            dataIndex: 'permissionRelationId',
            align: 'center',
            editable: false,
            renderText: (_, row) => {
                const text =
                    row.permissionType === PermissionTypeEnum.Api
                        ? row.subject?.subjectDesc
                        : row.menu?.name
                return text
            },
        },

        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 110,
            render: (_, row) => {
                const color = row.status === PermissionStatusEnum.Enabled ? 'success' : 'warning'
                const label = row.status === PermissionStatusEnum.Enabled ? '启用' : '禁用'
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

export default usePermissionListTable
