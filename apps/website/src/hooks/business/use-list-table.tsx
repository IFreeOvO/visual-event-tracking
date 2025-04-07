import type { TableButtonGroupProps } from '@/components/business/table-button-group'
import { EditableProTableProps, ProColumns } from '@ant-design/pro-components'
import { useDebounce, useMemoizedFn, useSize, useToggle } from 'ahooks'
import {
    ActionButtonGroupProps,
    onButtonGroupClickType,
} from '@/components/business/action-button-group'
import TableButtonGroup from '@/components/business/table-button-group'
import { TableButtonEnum } from '@/constants/enums'
import { EDITABLE_TABLE_ID } from '@/layouts/form-and-table-layout'
import emitter, { EmitterEventTypes } from '@/shared/emitter'
import usePagination from './use-pagination'

export interface UseListTableProps<TableData> {
    customTableProps?: EditableProTableProps<TableData, any>
    customColumns: ProColumns<TableData>[]
}

export interface TableExtensionData {
    showDeletePop: boolean
}

const useListTable = <TableData extends Record<string, any> & TableExtensionData>(
    props: UseListTableProps<TableData>,
) => {
    const { customTableProps = {}, customColumns = [] } = props
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
    const [tableData, setTableData] = useImmer<TableData[]>([])
    const editTableDom = document.querySelector(`#${EDITABLE_TABLE_ID}`)
    const tableSize = useSize(editTableDom)
    const debounceTableSize = useDebounce(tableSize, { wait: 200 })
    const [toolButtons] = useImmer<ActionButtonGroupProps['buttons']>(['add', 'refresh'])

    const onSave = useMemoizedFn(async (key, row, originRow) => {
        emitter.emit(EmitterEventTypes.onSaveTableRow, [key, row, originRow])
    })

    const onDelete = useMemoizedFn(async (key, row) => {
        emitter.emit(EmitterEventTypes.onDeleteTableRow, [key, row])
    })

    const rowKey = 'id'

    const tableProps = useMemo(() => {
        const paginationHeight = 42 // 这里多给2像素，为了让pagination显示完整
        const tableHeader = document.querySelector('.ant-table-thead')
        const tableHeaderHeight = tableHeader?.clientHeight ?? 0
        const scrollY = debounceTableSize?.height
            ? debounceTableSize?.height - tableHeaderHeight - paginationHeight
            : 0
        const tableProps: EditableProTableProps<TableData, any> = {
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
            editable: {
                onSave,
                onDelete,
            },
            ...customTableProps,
        }
        return tableProps
    }, [
        isLoading,
        page,
        pageSize,
        debounceTableSize,
        paginationTotal,
        customTableProps,
        pageSizeOptions,
        showTotal,
        onSave,
        onDelete,
    ])

    const updateDeletePopState = useMemoizedFn((id: number, value: boolean) => {
        setTableData((draft) => {
            draft.forEach((item) => {
                if (item.id === id) {
                    item.showDeletePop = value
                    return
                }
                if (item.children) {
                    item.children.forEach((child: any) => {
                        if (child.id === id) {
                            child.showDeletePop = value
                            return
                        }
                    })
                }
            })
        })
    })

    const columns = useMemo(() => {
        const columnConfig: ProColumns<TableData>[] = [
            ...customColumns,
            {
                title: '操作',
                align: 'center',
                valueType: 'option',
                className: 'table-action-column',
                width: 180,
                render: (_text, row, _index, action) => {
                    const tableActionButtons: TableButtonGroupProps['buttons'] = [
                        {
                            type: 'edit',
                            buttonProps: {
                                onClick: () => {
                                    action?.startEditable(row.id, row)
                                },
                            },
                        },
                        {
                            type: 'popDelete',
                            buttonProps: {
                                onClick: () => {
                                    updateDeletePopState(row.id, true)
                                },
                            },
                            popProps: {
                                title: '确认删除吗',
                                open: row.showDeletePop,
                                onConfirm: async () => {
                                    const key = row[rowKey as keyof typeof row]
                                    onDelete(key as React.Key, row)
                                },
                                onCancel: () => {
                                    updateDeletePopState(row.id, false)
                                },
                            },
                        },
                    ]

                    return (
                        <TableButtonGroup
                            justify="center"
                            componentSize="small"
                            buttons={tableActionButtons}
                        ></TableButtonGroup>
                    )
                },
            },
        ]
        return columnConfig
    }, [customColumns, rowKey, onDelete, updateDeletePopState])

    const onToolButtonClick = useMemoizedFn<onButtonGroupClickType>((_, buttonType) => {
        if (buttonType === TableButtonEnum.Add) {
            emitter.emit(EmitterEventTypes.onOpenAddDrawer)
        } else if (buttonType === TableButtonEnum.Refresh) {
            emitter.emit(EmitterEventTypes.onRefreshTable)
        }
    })

    return {
        isLoading,
        toolButtons,
        tableProps,
        columns,
        tableData,
        paginationTotal,
        page,
        pageSize,
        setPageSize,
        setPage,
        setPaginationTotal,
        onToolButtonClick,
        setTableData,
        toggleLoading,
    }
}

export default useListTable
