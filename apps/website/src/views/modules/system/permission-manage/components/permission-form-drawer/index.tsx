import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { Permission } from '@/models/vo/permission.vo'
import { Form, message, SelectProps } from 'antd'
import { createPermission } from '@/api/service/permission'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'
import { PermissionStatusEnum, PermissionTypeEnum } from '@/constants/enums'
import useResetImmer from '@/hooks/common/user-reset-immer'
import useStatusSelectOptions from '../../hooks/use-status-options'
import useTypeSelectOptions from '../../hooks/use-type-select-options'

export type PermissionFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: FormDrawerProps['onClose']
    onSubmitSuccess?: () => void
    menuOptions?: SelectProps['options']
    featureOptions?: SelectProps['options']
}

const PermissionFormDrawer: React.FC<PermissionFormDrawerProps> = (props) => {
    const { onDrawerClose, onSubmitSuccess, menuOptions = [], featureOptions = [] } = props
    const [drawerForm] = Form.useForm()
    const [permissionType, setPermissionType, resetPermissionType] =
        useResetImmer<PermissionTypeEnum>(PermissionTypeEnum.Menu)

    const [typeSelectOptions] = useTypeSelectOptions()
    const [statusSelectOptions] = useStatusSelectOptions()

    const formItemsConfig = useMemo<FormItemConfig<Permission>[]>(() => {
        const defaultType = typeSelectOptions[0]?.value
        const defaultRelationId = menuOptions[0]?.value
        const defaultCode = `${defaultType}:${defaultRelationId}`

        let relationId = defaultRelationId

        const config: FormItemConfig<Permission>[] = [
            {
                itemComponentProps: {
                    label: '权限类型',
                    name: 'permissionType',
                    rules: [{ required: true }],
                    initialValue: typeSelectOptions[0]?.value,
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    placeholder: '请选择权限类型',
                    options: typeSelectOptions,
                    onChange: (value: PermissionTypeEnum) => {
                        setPermissionType(value)
                        if (value === PermissionTypeEnum.Api) {
                            drawerForm.setFieldValue(
                                'permissionRelationId',
                                featureOptions[0]?.value,
                            )
                            relationId = featureOptions[0]?.value
                        } else if (value === PermissionTypeEnum.Menu) {
                            drawerForm.setFieldValue('permissionRelationId', menuOptions[0]?.value)
                            relationId = menuOptions[0]?.value
                        }
                        drawerForm.setFieldValue(
                            'permissionCode',
                            `${permissionType}:${relationId}`,
                        )
                    },
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '关联',
                    name: 'permissionRelationId',
                    rules: [{ required: true }],
                    initialValue: menuOptions[0]?.value,
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    showSearch: true,
                    optionFilterProp: 'label',
                    placeholder:
                        permissionType == PermissionTypeEnum.Api ? '请选择接口' : '请选择菜单',
                    options:
                        permissionType == PermissionTypeEnum.Api ? featureOptions : menuOptions,
                    onChange: (value: number) => {
                        relationId = value
                        drawerForm.setFieldValue('permissionCode', `${permissionType}:${value}`)
                    },
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '权限编码(自动生成)',
                    name: 'permissionCode',
                    rules: [{ required: true }],
                    initialValue: defaultCode,
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
                    label: '状态',
                    name: 'status',
                    initialValue: PermissionStatusEnum.Enabled,
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Radio',
                dynamicComponentProps: {
                    options: statusSelectOptions,
                },
                colProps: {
                    span: 24,
                },
            },
        ]
        return config
    }, [
        drawerForm,
        typeSelectOptions,
        menuOptions,
        statusSelectOptions,
        featureOptions,
        permissionType,
        setPermissionType,
    ])

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const reset = () => {
        drawerForm.resetFields()
        resetPermissionType()
    }

    const onFinish = (values: Permission) => {
        const params = Object.assign({}, values)
        createPermission(params).then(([err]) => {
            if (err) {
                return
            }
            message.open({
                content: '操作成功',
                type: 'success',
            })
            reset()
            if (onSubmitSuccess) {
                onSubmitSuccess()
            }
        })
    }

    const onClose = (e: React.MouseEvent | React.KeyboardEvent) => {
        reset()
        if (onDrawerClose) {
            onDrawerClose(e)
        }
    }

    const onCancel = (e: React.MouseEvent | React.KeyboardEvent) => {
        reset()

        if (onDrawerClose) {
            onDrawerClose(e)
        }
    }

    return (
        <>
            <FormDrawer {...props} onClose={onClose} onSubmit={onDrawerSubmit} onCancel={onCancel}>
                <DynamicForm<Permission>
                    formItemsConfig={formItemsConfig}
                    form={drawerForm}
                    onFinish={onFinish}
                    name="permission-drawer-form"
                ></DynamicForm>
            </FormDrawer>
        </>
    )
}

export default PermissionFormDrawer
