import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchLogForm } from '@/models/vo/tracking.vo'
import type { ColProps, FormProps, SelectProps } from 'antd'
import { useMount } from 'ahooks'
import { getProjects } from '@/api/service/project'
import { EventTypeEnum } from '@/constants/enums'
import useSearchForm from '@/hooks/business/use-search-form'

const useLogSearchForm = () => {
    const [projectOptions, setProjectOptions] = useImmer<SelectProps['options']>([])

    const formItemList = useMemo(() => {
        const typeSelectOptions = [
            { value: EventTypeEnum.Click, label: '点击' },
            { value: EventTypeEnum.Expose, label: '曝光' },
        ]
        const colProps = {
            xl: { span: 24 },
            md: { span: 24 },
        } as unknown as ColProps
        const itemList: FormItemConfig<SearchLogForm>[] = [
            {
                itemComponentProps: {
                    label: '项目',
                    name: 'projectId',
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    placeholder: '请选择项目',
                    allowClear: true,
                    options: projectOptions,
                },
            },
            {
                itemComponentProps: {
                    label: '事件类型',
                    name: 'eventType',
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    placeholder: '请输入事件类型',
                    allowClear: true,
                    options: typeSelectOptions,
                },
            },
            {
                itemComponentProps: {
                    label: '事件名称',
                    name: 'eventName',
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入事件名称',
                    allowClear: true,
                },
            },
            {
                itemComponentProps: {
                    label: '页面地址',
                    name: 'url',
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入页面地址',
                    allowClear: true,
                },
            },
            {
                colProps,
                itemComponentProps: {
                    label: '发生时间',
                    name: 'eventTime',
                    labelCol: {
                        span: 4,
                    },
                    wrapperCol: { span: 20 },
                },
                dynamicComponentType: 'RangePicker',
                dynamicComponentProps: {
                    allowClear: true,
                    showTime: true,
                },
            },
        ]
        return itemList
    }, [projectOptions])

    const { searchForm, formData, formProps, formItems, setFormData } =
        useSearchForm<SearchLogForm>(formItemList)

    const newFormProps = useMemo<FormProps>(
        () => ({
            ...formProps,
            layout: 'vertical',
        }),
        [formProps],
    )

    const getProjectList = async () => {
        const [err, res] = await getProjects({
            page: 1,
        })
        if (err) {
            return
        }
        const data = res.data.data
        const options = data.map((item) => ({
            value: item.id,
            label: item.projectName,
        }))
        setProjectOptions(options)
    }

    useMount(() => {
        getProjectList()
    })

    return {
        searchForm,
        formData,
        formProps: newFormProps,
        formItems,
        setFormData,
    }
}

export default useLogSearchForm
