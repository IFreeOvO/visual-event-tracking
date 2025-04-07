import type { TableDataType } from './hooks/use-action-list-table'
import type { SearchActionForm } from '@/models/dto/action.dto'
import type { Action } from '@/models/vo/action.vo'
import { useMemoizedFn, useMount } from 'ahooks'
import { message } from 'antd'
import { assign, omit } from 'lodash-es'
import { deleteAction, getActions, updateAction } from '@/api/service/action'
import useDrawer from '@/hooks/business/use-drawer'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import ActionFormDrawer from './components/action-form-drawer'
import useActionListTable from './hooks/use-action-list-table'
import useActionSearchForm from './hooks/use-action-search-form'

const ActionManage: React.FC = () => {
    const { isOpenDrawer, drawerTitle, toggleDrawerState, onDrawerSubmitSuccess } = useDrawer({
        title: '新增行为',
    })
    const { formData, formProps, formItems, searchForm, setFormData } = useActionSearchForm()
    const {
        toolButtons,
        tableProps,
        columns,
        tableData,
        page,
        pageSize,
        toggleLoading,
        onToolButtonClick,
        setTableData,
        setPageSize,
        setPage,
        setPaginationTotal,
    } = useActionListTable()

    const queryList = useMemoizedFn(async (params: Parameters<typeof getActions>[0]) => {
        toggleLoading()
        const [err, res] = await getActions({
            ...params,
        })

        if (err) {
            toggleLoading()
            return
        }

        const data = res.data.data
        const tableDataSource: TableDataType[] = data.reduce((list: TableDataType[], item) => {
            list.push({
                ...item,
                showDeletePop: false,
            })

            return list
        }, [])

        setTableData(tableDataSource)
        setPaginationTotal(res.data.total)
        toggleLoading()
    })

    const handleDrawerSubmitSuccess = () => {
        toggleDrawerState()
        queryList({
            page,
            limit: pageSize,
            filter: formData,
        })
    }

    const onSearchFinish = (values: SearchActionForm) => {
        setPage(1)
        setFormData((draft) => {
            assign(draft, values)
            queryList({
                page: 1,
                limit: pageSize,
                filter: values,
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

    const onSaveRow = async ([, row]: [
        key: React.Key | React.Key[],
        row: Action,
        originRow?: Action,
    ]) => {
        const params = omit(row, ['id', 'showDeletePop', 'index'])
        const [err] = await updateAction(row.id, params as Action)
        if (!err) {
            message.open({
                content: '操作成功',
                type: 'success',
            })
            queryList({
                page,
                limit: pageSize,
                filter: formData,
            })
        }
    }

    const onDeleteRow = async ([, row]: [key: React.Key | React.Key[], row: Action]) => {
        const [err] = await deleteAction(row.id)
        if (!err) {
            message.open({
                content: '操作成功',
                type: 'success',
            })
            queryList({
                page,
                limit: pageSize,
                filter: formData,
            })
        }
    }

    useEmitterListener(EmitterEventTypes.onDrawerSubmitSuccess, handleDrawerSubmitSuccess)
    useEmitterListener(EmitterEventTypes.onSearchFinish, onSearchFinish)
    useEmitterListener(EmitterEventTypes.onOpenAddDrawer, toggleDrawerState)
    useEmitterListener(EmitterEventTypes.onRefreshTable, onRefresh)
    useEmitterListener(EmitterEventTypes.onPaginationChange, onPaginationChange)
    useEmitterListener(EmitterEventTypes.onSaveTableRow, onSaveRow)
    useEmitterListener(EmitterEventTypes.onDeleteTableRow, onDeleteRow)

    useMount(() => {
        queryList({
            page,
            limit: pageSize,
            filter: formData,
        })
    })

    return (
        <>
            <FormAndTableLayout<TableDataType, SearchActionForm>
                title="行为列表"
                toolButtons={toolButtons}
                onToolButtonClick={onToolButtonClick}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
            <ActionFormDrawer
                drawerTitle={drawerTitle}
                onDrawerClose={toggleDrawerState}
                onSubmitSuccess={onDrawerSubmitSuccess}
                open={isOpenDrawer}
            ></ActionFormDrawer>
        </>
    )
}

export default ActionManage
