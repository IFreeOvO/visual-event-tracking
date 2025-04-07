import type { TableDataType } from './hooks/use-role-list-table'
import type { SearchRoleForm } from '@/models/dto/role.dto'
import type { Role } from '@/models/vo/role.vo'
import { useMemoizedFn, useMount } from 'ahooks'
import { message } from 'antd'
import { assign, omit } from 'lodash-es'
import { deleteRole, getRole, updateRole } from '@/api/service/role'
import useDrawer from '@/hooks/business/use-drawer'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import FeaturePermissionDialog from './components/feature-permission-dialog'
import MenuPermissionDialog from './components/menu-permission-dialog'
import RoleFormDrawer from './components/role-form-drawer'
import useFeaturePermissionDialog from './hooks/use-feature-permission-dialog'
import useMenuPermissionDialog from './hooks/use-menu-permission-dialog'
import useRoleListTable from './hooks/use-role-list-table'
import useRoleSearchForm from './hooks/use-role-search-form'

const RoleManagePage: React.FC = () => {
    const [roleId, setRoleId] = useImmer<number>(-1)
    const { isMenuModalOpen, toggleMenuModalOpen, onMenuModalOk } = useMenuPermissionDialog()
    const { isFeatureModalOpen, toggleFeatureModalOpen, onFeatureModalOk } =
        useFeaturePermissionDialog()
    const { isOpenDrawer, drawerTitle, toggleDrawerState, onDrawerSubmitSuccess } = useDrawer({
        title: '新增角色',
    })
    const { formData, formProps, formItems, searchForm, setFormData } = useRoleSearchForm()
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
    } = useRoleListTable()

    const queryList = useMemoizedFn(async (params: Parameters<typeof getRole>[0]) => {
        toggleLoading()
        const [err, res] = await getRole({
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

    const onSearchFinish = (values: SearchRoleForm) => {
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
        row: Role,
        originRow?: Role,
    ]) => {
        const params = omit(row, ['id', 'showDeletePop', 'index'])
        const [err] = await updateRole(row.id, params as Role)
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

    const onDeleteRow = async ([, row]: [key: React.Key | React.Key[], row: Role]) => {
        const [err] = await deleteRole(row.id)
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

    const onClickMenuPermission = (row: Role) => {
        setRoleId(row.id)
        toggleMenuModalOpen()
    }

    const onClickFeaturePermission = (row: Role) => {
        setRoleId(row.id)
        toggleFeatureModalOpen()
    }

    useEmitterListener(EmitterEventTypes.onDrawerSubmitSuccess, handleDrawerSubmitSuccess)
    useEmitterListener(EmitterEventTypes.onSearchFinish, onSearchFinish)
    useEmitterListener(EmitterEventTypes.onOpenAddDrawer, toggleDrawerState)
    useEmitterListener(EmitterEventTypes.onRefreshTable, onRefresh)
    useEmitterListener(EmitterEventTypes.onPaginationChange, onPaginationChange)
    useEmitterListener(EmitterEventTypes.onSaveTableRow, onSaveRow)
    useEmitterListener(EmitterEventTypes.onDeleteTableRow, onDeleteRow)
    useEmitterListener(EmitterEventTypes.onClickMenuPermissionButton, onClickMenuPermission)
    useEmitterListener(EmitterEventTypes.onClickFeaturePermissionButton, onClickFeaturePermission)

    useMount(() => {
        queryList({
            page,
            limit: pageSize,
            filter: formData,
        })
    })

    return (
        <>
            <FormAndTableLayout<TableDataType, SearchRoleForm>
                title="角色列表"
                toolButtons={toolButtons}
                onToolButtonClick={onToolButtonClick}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
            <RoleFormDrawer
                drawerTitle={drawerTitle}
                onDrawerClose={toggleDrawerState}
                onSubmitSuccess={onDrawerSubmitSuccess}
                open={isOpenDrawer}
            ></RoleFormDrawer>
            <MenuPermissionDialog
                roleId={roleId}
                isOpen={isMenuModalOpen}
                onCancel={toggleMenuModalOpen}
                onOk={onMenuModalOk}
            ></MenuPermissionDialog>
            <FeaturePermissionDialog
                roleId={roleId}
                isOpen={isFeatureModalOpen}
                onCancel={toggleFeatureModalOpen}
                onOk={onFeatureModalOk}
            ></FeaturePermissionDialog>
        </>
    )
}

export default RoleManagePage
