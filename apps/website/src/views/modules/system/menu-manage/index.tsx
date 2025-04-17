import type { MenuFormDrawerProps } from './components/menu-form-drawer'
import type { TableDataType } from './hooks/use-menu-list-table'
import type { SearchMenuForm } from '@/models/dto/menu.dto'
import type { Menu } from '@/models/vo/menu.vo'
import { useMemoizedFn, useMount } from 'ahooks'
import { message } from 'antd'
import { assign, omit } from 'lodash-es'
import { deleteMenu, getMenus, updateMenu } from '@/api/service/menu'
import { LazyImportOnCondition } from '@/components/common/lazy-import-on-condition'
import useDrawer from '@/hooks/business/use-drawer'
import useMenuRefresh from '@/hooks/business/use-menu-items'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import useMenuListTable from './hooks/use-menu-list-table'
import useMenuSearchForm from './hooks/use-menu-search-form'
const MenuFormDrawer = lazy(() => import('./components/menu-form-drawer'))

const MenuManagePage: React.FC = () => {
    const refreshMenuItems = useMenuRefresh()
    const { isOpenDrawer, drawerTitle, toggleDrawerState, onDrawerSubmitSuccess } = useDrawer({
        title: '新增菜单',
    })
    const { formData, formProps, formItems, searchForm, setFormData } = useMenuSearchForm()
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
    } = useMenuListTable()

    const queryMenus = useMemoizedFn(async (params: Parameters<typeof getMenus>[0]) => {
        toggleLoading()
        const [err, res] = await getMenus({
            ...params,
            sort: ['order', 'ASC'],
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
        setTableData(tableDataSource as any)
        setPaginationTotal(res.data.total)
        toggleLoading()
    })

    const handleDrawerSubmitSuccess = () => {
        toggleDrawerState()
        queryMenus({
            page,
            limit: pageSize,
            filter: formData,
        })
    }

    const onSearchFinish = (values: SearchMenuForm) => {
        setPage(1)
        setFormData((draft) => {
            assign(draft, values)
            queryMenus({
                page: 1,
                limit: pageSize,
                filter: values,
            })
        })
    }

    const onRefresh = () => {
        queryMenus({
            page,
            limit: pageSize,
            filter: formData,
        })
    }

    const onPaginationChange = ([page, pageSize]: [page: number, pageSize: number]) => {
        setPage(page)
        setPageSize(pageSize)
        queryMenus({
            page,
            limit: pageSize,
            filter: formData,
        })
    }

    const onSaveRow = async ([, row]: [
        key: React.Key | React.Key[],
        row: Menu,
        originRow?: Menu,
    ]) => {
        const params = omit(row, ['id', 'showDeletePop', 'index', 'children'])
        if (params.componentName === undefined) {
            params.componentName = ''
        }

        const [err] = await updateMenu(row.id, params as Menu)
        if (!err) {
            refreshMenuItems()
            message.open({
                content: '操作成功',
                type: 'success',
            })
            queryMenus({
                page,
                limit: pageSize,
                filter: formData,
            })
        }
    }

    const onDeleteRow = async ([, row]: [key: React.Key | React.Key[], row: Menu]) => {
        const [err] = await deleteMenu(row.id)
        if (!err) {
            refreshMenuItems()
            message.open({
                content: '操作成功',
                type: 'success',
            })
            queryMenus({
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
        queryMenus({
            page,
            limit: pageSize,
            filter: formData,
        })
    })

    return (
        <>
            <FormAndTableLayout<TableDataType, SearchMenuForm>
                title="菜单列表"
                toolButtons={toolButtons}
                onToolButtonClick={onToolButtonClick}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
            <LazyImportOnCondition<MenuFormDrawerProps>
                lazy={MenuFormDrawer}
                isLoad={isOpenDrawer}
                componentProps={{
                    drawerTitle,
                    onDrawerClose: toggleDrawerState,
                    onSubmitSuccess: onDrawerSubmitSuccess,
                    open: isOpenDrawer,
                }}
            ></LazyImportOnCondition>
        </>
    )
}

export default MenuManagePage
