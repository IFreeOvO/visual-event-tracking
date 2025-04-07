import type { Role } from '@/models/vo/role.vo'
import type { ProColumns } from '@ant-design/pro-components'
import { Button, Flex, Tag } from 'antd'
import { RoleStatusEnum } from '@/constants/enums'
import useListTable from '@/hooks/business/use-list-table'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

export type TableDataType = Role & {
    showDeletePop: boolean
}

const useRoleListTable = () => {
    const onClickMenuPermissionBtn = (row: TableDataType) => {
        emitter.emit(EmitterEventTypes.onClickMenuPermissionButton, row)
    }

    const onClickFeaturePermissionBtn = (row: TableDataType) => {
        emitter.emit(EmitterEventTypes.onClickFeaturePermissionButton, row)
    }

    const [customColumns] = useImmer<ProColumns<TableDataType>[]>([
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            width: 80,
            readonly: true,
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',
            align: 'center',
            ellipsis: true,
            valueType: 'text',
        },
        {
            title: '角色描述',
            dataIndex: 'roleDesc',
            align: 'center',
            ellipsis: true,
            valueType: 'text',
        },
        {
            title: '角色编码',
            dataIndex: 'roleCode',
            align: 'center',
            ellipsis: true,
            valueType: 'text',
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 110,
            render: (_, row) => {
                const color = row.status === RoleStatusEnum.Enabled ? 'success' : 'warning'
                const label = row.status === RoleStatusEnum.Enabled ? '启用' : '禁用'
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
        {
            title: '权限',
            align: 'center',
            ellipsis: true,
            editable: false,
            render: (_, row) => {
                return (
                    <Flex wrap gap="middle">
                        <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => onClickMenuPermissionBtn(row)}
                        >
                            授权菜单
                        </Button>
                        <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            onClick={() => onClickFeaturePermissionBtn(row)}
                        >
                            授权功能
                        </Button>
                    </Flex>
                )
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

export default useRoleListTable
