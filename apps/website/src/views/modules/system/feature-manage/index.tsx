import type { FeatureFormDrawerProps } from './components/feature-form-drawer'
import type { TableDataType } from './hooks/use-feature-list-table'
import type { SearchFeatureForm, UpdateFeature } from '@/models/dto/feature.dto'
import type { Feature } from '@/models/vo/feature.vo'
import type { SelectProps } from 'antd'
import { useMemoizedFn, useMount } from 'ahooks'
import { message } from 'antd'
import { assign } from 'lodash-es'
import { getActions } from '@/api/service/action'
import { deleteFeature, getFeatures, updateFeature } from '@/api/service/feature'
import { LazyImportOnCondition } from '@/components/common/lazy-import-on-condition'
import useDrawer from '@/hooks/business/use-drawer'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import FormAndTableLayout from '@/layouts/form-and-table-layout'
import { EmitterEventTypes } from '@/shared/emitter'
import useFeatureListTable from './hooks/use-feature-list-table'
import useFeatureSearchForm from './hooks/use-feature-search-form'
const FeatureFormDrawer = lazy(() => import('./components/feature-form-drawer'))

const FeatureManage: React.FC = () => {
    const [actionOptions, setActionOptions] = useImmer<
        SelectProps['options'] & {
            actionName?: string
        }
    >([])
    const { isOpenDrawer, drawerTitle, toggleDrawerState, onDrawerSubmitSuccess } = useDrawer({
        title: '新增功能',
    })
    const { formData, formProps, formItems, searchForm, setFormData } = useFeatureSearchForm()
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
    } = useFeatureListTable()

    const queryList = useMemoizedFn(async (params: Parameters<typeof getFeatures>[0]) => {
        toggleLoading()
        const [err, res] = await getFeatures({
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

    const onSearchFinish = (values: SearchFeatureForm) => {
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
        row: Omit<TableDataType, 'actions'> & { actions: number[] },
        originRow?: Omit<TableDataType, 'actions'> & { actions: number[] },
    ]) => {
        const params = {
            subjectDesc: row.subjectDesc,
        }
        const [err] = await updateFeature(row.id, params as UpdateFeature)
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

    const onDeleteRow = async ([, row]: [key: React.Key | React.Key[], row: Feature]) => {
        const [err] = await deleteFeature(row.id)
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

    const getActionsOptions = useMemoizedFn(async () => {
        const [err, res] = await getActions({
            page: 1,
        })
        if (err) {
            return
        }

        const options = res.data.data.map((action) => {
            return {
                value: action.id,
                label: action.actionDesc,
                actionName: action.actionName,
            }
        })

        setActionOptions(options)
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
        getActionsOptions()
    })

    return (
        <>
            <FormAndTableLayout<TableDataType, SearchFeatureForm>
                title="功能列表"
                toolButtons={toolButtons}
                onToolButtonClick={onToolButtonClick}
                form={searchForm}
                tableProps={tableProps}
                columns={columns}
                dataSource={tableData}
                formProps={formProps}
                formItems={formItems}
            ></FormAndTableLayout>
            <LazyImportOnCondition<FeatureFormDrawerProps>
                lazy={FeatureFormDrawer}
                isLoad={isOpenDrawer}
                componentProps={{
                    drawerTitle,
                    actionOptions,
                    onDrawerClose: toggleDrawerState,
                    onSubmitSuccess: onDrawerSubmitSuccess,
                    open: isOpenDrawer,
                }}
            ></LazyImportOnCondition>
        </>
    )
}

export default FeatureManage
