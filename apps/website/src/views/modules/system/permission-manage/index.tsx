import type { TableDataType } from './hooks/use-permission-list-table'
import type { SearchPermissionForm } from '@/models/dto/permission.dto'
import type { Permission } from '@/models/vo/permission.vo'
import { useMemoizedFn, useMount } from 'ahooks'
import { message } from 'antd'
import { assign } from 'lodash-es'
import { deletePermission, getPermissions, updatePermission } from '@/api/service/permission'
import { PermissionTypeEnum } from '@/constants/enums'
import useMenuRefresh from '@/hooks/business/use-menu-items'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import PermissionFormDrawer from './components/permission-form-drawer'
import usePermissionDrawer from './hooks/use-permission-drawer'
import usePermissionListTable from './hooks/use-permission-list-table'
import usePermissionSearchForm from './hooks/use-permission-search-form'

const PermissionManagePage: React.FC = () => {
    const refreshMenuItems = useMenuRefresh()
    const {
        featureOptions,
        menuOptions,
        isOpenDrawer,
        drawerTitle,
        toggleDrawerState,
        onDrawerSubmitSuccess,
    } = usePermissionDrawer()
    const { formData, formProps, formItems, searchForm, setFormData } = usePermissionSearchForm()
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
    } = usePermissionListTable()

    const queryList = useMemoizedFn(async (params: Parameters<typeof getPermissions>[0]) => {
        toggleLoading()
        const [err, res] = await getPermissions({
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

    const onSearchFinish = (values: SearchPermissionForm) => {
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
        row: Permission,
        originRow?: Permission,
    ]) => {
        const params = {
            status: row.status,
        }
        const [err] = await updatePermission(row.id, params as Permission)
        if (!err) {
            if (row.permissionType === PermissionTypeEnum.Menu) {
                refreshMenuItems()
            }
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

    const onDeleteRow = async ([, row]: [key: React.Key | React.Key[], row: Permission]) => {
        const [err] = await deletePermission(row.id)
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
            <FormAndTableLayout<TableDataType, SearchPermissionForm>
                title="权限列表"
                toolButtons={toolButtons}
                onToolButtonClick={onToolButtonClick}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
            <PermissionFormDrawer
                featureOptions={featureOptions}
                menuOptions={menuOptions}
                drawerTitle={drawerTitle}
                onDrawerClose={toggleDrawerState}
                onSubmitSuccess={onDrawerSubmitSuccess}
                open={isOpenDrawer}
            ></PermissionFormDrawer>
        </>
    )
}

export default PermissionManagePage
