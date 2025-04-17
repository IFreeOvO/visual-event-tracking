import type { UserFormDrawerProps } from './components/user-form-drawer'
import type { TableDataType } from './hooks/use-user-list-table'
import type { SearchUserForm, UpdateUser } from '@/models/dto/user.dto'
import type { User } from '@/models/vo/user.vo'
import { useMemoizedFn, useMount } from 'ahooks'
import { message, SelectProps } from 'antd'
import { assign, omit } from 'lodash-es'
import { getRole } from '@/api/service/role'
import { deleteUser, getUser, updateUser } from '@/api/service/user'
import { LazyImportOnCondition } from '@/components/common/lazy-import-on-condition'
import { RoleStatusEnum } from '@/constants/enums'
import useDrawer from '@/hooks/business/use-drawer'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import useUserListTable from './hooks/use-user-list-table'
import useUserSearchForm from './hooks/use-user-search-form'
const UserFormDrawer = lazy(() => import('./components/user-form-drawer'))

const UserManagePage: React.FC = () => {
    const [roleOptions, setRoleOptions] = useImmer<SelectProps['options']>([])

    const { isOpenDrawer, drawerTitle, toggleDrawerState, onDrawerSubmitSuccess } = useDrawer({
        title: '新增用户',
    })
    const { formData, formProps, formItems, searchForm, setFormData } = useUserSearchForm()
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
    } = useUserListTable({ roleOptions })

    const queryList = useMemoizedFn(async (params: Parameters<typeof getUser>[0]) => {
        toggleLoading()
        const [err, res] = await getUser({
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
                roles: item.roles.filter((item) => item.status === RoleStatusEnum.Enabled),
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

    const onSearchFinish = (values: SearchUserForm) => {
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
        row: Omit<TableDataType, 'roles'> & { roles: number[] },
        originRow?: Omit<TableDataType, 'roles' & { roles: number[] }>,
    ]) => {
        const params = omit(row, ['id', 'showDeletePop', 'index'])
        const [err] = await updateUser(row.id, params as UpdateUser)
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

    const onDeleteRow = async ([, row]: [key: React.Key | React.Key[], row: User]) => {
        const [err] = await deleteUser(row.id)
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

    const getRoleOptions = useMemoizedFn(async () => {
        const [err, res] = await getRole({
            page: 1,
            filter: {
                status: RoleStatusEnum.Enabled,
            },
        })
        if (err) {
            return
        }

        const options = res.data.data.map((role) => {
            return {
                value: role.id,
                label: role.roleName,
            }
        })

        setRoleOptions(options)
    })

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
        getRoleOptions()
    })

    return (
        <>
            <FormAndTableLayout<TableDataType, SearchUserForm>
                title="用户列表"
                toolButtons={toolButtons}
                onToolButtonClick={onToolButtonClick}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
            <LazyImportOnCondition<UserFormDrawerProps>
                lazy={UserFormDrawer}
                isLoad={isOpenDrawer}
                componentProps={{
                    drawerTitle,
                    roleOptions,
                    onDrawerClose: toggleDrawerState,
                    onSubmitSuccess: onDrawerSubmitSuccess,
                    open: isOpenDrawer,
                }}
            ></LazyImportOnCondition>
        </>
    )
}

export default UserManagePage
