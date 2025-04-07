import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { Role } from '@/models/vo/role.vo'
import { Form, message } from 'antd'
import { createRole } from '@/api/service/role'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'
import { RoleStatusEnum } from '@/constants/enums'

export type MenuFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: FormDrawerProps['onClose']
    onSubmitSuccess?: () => void
}

const RoleFormDrawer: React.FC<MenuFormDrawerProps> = memo((props) => {
    const { onDrawerClose, onSubmitSuccess } = props
    const [drawerForm] = Form.useForm()

    const [statusRadioOptions] = useImmer([
        { value: RoleStatusEnum.Enabled, label: '启用' },
        { value: RoleStatusEnum.Disabled, label: '禁用' },
    ])

    const formItemsConfig = useMemo<FormItemConfig<Role>[]>(
        () => [
            {
                itemComponentProps: {
                    label: '角色名称',
                    name: 'roleName',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入角色名称',
                    allowClear: true,
                    maxLength: 20,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '角色描述',
                    name: 'roleDesc',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入角色描述',
                    allowClear: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '角色编码',
                    name: 'roleCode',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入角色编码',
                    allowClear: true,
                    maxLength: 50,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '状态',
                    name: 'status',
                    initialValue: RoleStatusEnum.Enabled,
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Radio',
                dynamicComponentProps: {
                    options: statusRadioOptions,
                },
                colProps: {
                    span: 24,
                },
            },
        ],
        [statusRadioOptions],
    )

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const onFinish = (values: Role) => {
        const params = Object.assign({}, values)
        createRole(params).then(([err]) => {
            if (err) {
                return
            }
            message.open({
                content: '操作成功',
                type: 'success',
            })
            drawerForm.resetFields()
            if (onSubmitSuccess) {
                onSubmitSuccess()
            }
        })
    }

    const onClose: FormDrawerProps['onClose'] = (e) => {
        drawerForm.resetFields()
        if (onDrawerClose) {
            onDrawerClose(e)
        }
    }

    const onCancel: FormDrawerProps['onCancel'] = (e) => {
        drawerForm.resetFields()
        if (onDrawerClose) {
            onDrawerClose(e)
        }
    }

    return (
        <>
            <FormDrawer {...props} onClose={onClose} onSubmit={onDrawerSubmit} onCancel={onCancel}>
                <DynamicForm<Role>
                    formItemsConfig={formItemsConfig}
                    form={drawerForm}
                    onFinish={onFinish}
                    name="role-drawer-form"
                ></DynamicForm>
            </FormDrawer>
        </>
    )
})

export default RoleFormDrawer
