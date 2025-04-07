import type { Menu } from '@/models/vo/menu.vo'
import type { EditableProTableProps, ProColumns } from '@ant-design/pro-components'
import { useMemoizedFn } from 'ahooks'
import { Space, Tag } from 'antd'
import { VisibleStatusEnum } from '@/constants/enums'
import { MenuIcons } from '@/constants/icons'
import useListTable from '@/hooks/business/use-list-table'
import { optionsToValueEnum } from '@/shared/options-to-value-enum'
import IconSelect from '../components/icon-select'
import useComponentsOptions from './use-components-options'
import useLayoutOptions from './use-layout-options'

export type TableDataType = Menu & {
    showDeletePop: boolean
}

const useMenuListTable = () => {
    const [componentsSelectOptions] = useComponentsOptions()
    const [layoutOptions] = useLayoutOptions()
    const layoutValueEnum = useMemo(() => {
        return optionsToValueEnum(layoutOptions)
    }, [layoutOptions])

    const getComponents = useMemoizedFn(() => {
        const componentEnum: Record<string, { text: string }> = {}
        componentsSelectOptions.forEach((item) => {
            componentEnum[item.value] = { text: item.label }
        })
        return componentEnum
    })

    const [customTableProps] = useImmer<EditableProTableProps<TableDataType, any>>({
        rowClassName,
    })

    const [customColumns] = useImmer<ProColumns<TableDataType>[]>([
        {
            title: 'id',
            dataIndex: 'id',
            align: 'center',
            width: 80,
            readonly: true,
        },
        {
            title: '菜单名称',
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
            width: 150,
            valueType: 'text',
        },
        {
            title: '图标',
            dataIndex: 'icon',
            align: 'center',
            width: 190,
            render: (_, row) => {
                const IconComponent = MenuIcons[row.icon as keyof typeof MenuIcons]
                return IconComponent ? (
                    <Space>
                        <IconComponent />
                        {row.icon}
                    </Space>
                ) : (
                    <span>-</span>
                )
            },
            renderFormItem: () => {
                return <IconSelect />
            },
            editable: (_, record) => {
                const isParentMenu = record.parentId === 0
                return isParentMenu
            },
        },
        {
            title: '路由',
            dataIndex: 'path',
            align: 'center',
            width: 180,
            ellipsis: true,
        },
        {
            title: '组件名称',
            dataIndex: 'componentName',
            align: 'center',
            width: 180,
            ellipsis: true,
            valueType: 'select',
            valueEnum: getComponents(),
        },
        {
            title: '布局',
            dataIndex: 'layout',
            align: 'center',
            width: 110,
            valueType: 'select',
            valueEnum: layoutValueEnum,
        },
        {
            title: '父级菜单id',
            dataIndex: 'parentId',
            align: 'center',
            width: 110,
            valueType: 'digit',
            editable: false,
        },
        {
            title: '排序',
            dataIndex: 'order',
            align: 'center',
            width: 100,
            valueType: 'digit',
        },
        {
            title: '显示状态',
            dataIndex: 'visibleStatus',
            align: 'center',
            width: 110,
            render: (_, row) => {
                const color =
                    row.visibleStatus === VisibleStatusEnum.Visible ? 'success' : 'warning'
                const label = row.visibleStatus === VisibleStatusEnum.Visible ? '显示' : '隐藏'
                return <Tag color={color}>{label}</Tag>
            },
            valueType: 'select',
            valueEnum: {
                '0': { text: '隐藏' },
                '1': {
                    text: '显示',
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
        customTableProps,
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

export default useMenuListTable

function rowClassName(record: TableDataType) {
    const isChild = record.parentId !== 0
    return isChild ? 'uno-bg-[rgba(0,0,0,0.06)]' : ''
}
