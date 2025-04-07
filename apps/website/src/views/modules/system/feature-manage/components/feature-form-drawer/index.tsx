import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { AddFeature } from '@/models/dto/feature.dto'
import type { SelectProps } from 'antd'
import { useMount } from 'ahooks'
import { Form, message } from 'antd'
import { createFeature, getSubjectNames } from '@/api/service/feature'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'

export type FeatureFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: FormDrawerProps['onClose']
    onSubmitSuccess?: () => void
    actionOptions?: SelectProps['options'] & {
        actionName?: string
    }
}

const FeatureFormDrawer: React.FC<FeatureFormDrawerProps> = memo((props) => {
    const { onDrawerClose, onSubmitSuccess, actionOptions = [] } = props
    const [drawerForm] = Form.useForm()
    const [subjectOptions, setSubjectOptions] = useImmer<SelectProps['options']>([])
    const [subjectName, setSubjectName] = useImmer<string>('')
    const [actionName, setActionName] = useImmer<number | undefined>(actionOptions[0]?.actionName)
    const defaultSubjectName = useRef<string>('')

    const formItemsConfig = useMemo<FormItemConfig<AddFeature>[]>(() => {
        const config: FormItemConfig<AddFeature>[] = [
            {
                itemComponentProps: {
                    label: '功能',
                    name: 'subjectName',
                    rules: [{ required: true }],
                    initialValue: subjectName,
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    showSearch: true,
                    optionFilterProp: 'label',
                    placeholder: '请输入功能',
                    options: subjectOptions,
                    onChange: (value: string) => {
                        setSubjectName(value)
                        drawerForm.setFieldValue(
                            'subjectCode',
                            `${value}:${actionName ?? actionOptions[0]?.actionName}`,
                        )
                        drawerForm.setFieldValue(
                            'subjectDesc',
                            `${value}表-${actionName ?? actionOptions[0]?.label}`,
                        )
                    },
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '功能编码(自动生成)',
                    name: 'subjectCode',
                    rules: [{ required: true }],
                    initialValue: `${subjectName}:${actionOptions[0]?.actionName}`,
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    disabled: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '功能描述(自动生成)',
                    name: 'subjectDesc',
                    rules: [{ required: true }],
                    initialValue: `${subjectName}表-${actionOptions[0]?.label}`,
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    disabled: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '支持行为',
                    name: 'actionId',
                    rules: [{ required: true }],
                    initialValue: actionOptions[0]?.value,
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    showSearch: true,
                    optionFilterProp: 'label',
                    options: actionOptions,
                    onChange: (_: any, option: Record<string, any>) => {
                        setActionName(option.actionName)
                        drawerForm.setFieldValue(
                            'subjectCode',
                            `${subjectName}:${option.actionName}`,
                        )
                        drawerForm.setFieldValue('subjectDesc', `${subjectName}表-${option.label}`)
                    },
                },
                colProps: {
                    span: 24,
                },
            },
        ]

        return config
    }, [
        drawerForm,
        actionOptions,
        subjectOptions,
        subjectName,
        actionName,
        setSubjectName,
        setActionName,
    ])

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const resetForm = () => {
        drawerForm.resetFields()
        drawerForm.setFieldValue('subjectName', defaultSubjectName.current)
    }

    const onFinish = (values: AddFeature) => {
        const params = Object.assign({}, values)
        createFeature(params).then(([err]) => {
            if (err) {
                return
            }
            message.open({
                content: '操作成功',
                type: 'success',
            })
            resetForm()
            if (onSubmitSuccess) {
                onSubmitSuccess()
            }
        })
    }

    const onClose: FormDrawerProps['onClose'] = (e) => {
        resetForm()

        if (onDrawerClose) {
            onDrawerClose(e)
        }
    }

    const onCancel: FormDrawerProps['onCancel'] = (e) => {
        resetForm()
        if (onDrawerClose) {
            onDrawerClose(e)
        }
    }

    const getSubjectOptions = async () => {
        const [err, res] = await getSubjectNames()
        if (err) {
            return
        }
        const options = res.data.map((item) => ({
            value: item,
            label: item,
        }))
        setSubjectOptions(options)
        defaultSubjectName.current = options[0].label

        setSubjectName(options[0].label)
    }

    useMount(() => {
        getSubjectOptions()
    })

    return (
        <>
            <FormDrawer {...props} onClose={onClose} onSubmit={onDrawerSubmit} onCancel={onCancel}>
                <DynamicForm<AddFeature>
                    formItemsConfig={formItemsConfig}
                    form={drawerForm}
                    onFinish={onFinish}
                    name="action-drawer-form"
                ></DynamicForm>
            </FormDrawer>
        </>
    )
})

export default FeatureFormDrawer
