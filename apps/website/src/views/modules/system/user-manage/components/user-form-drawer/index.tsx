import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { AddUser } from '@/models/dto/user.dto'
import { Form, message, SelectProps } from 'antd'

import { createUser } from '@/api/service/user'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'
import { UserStatusEnum } from '@/constants/enums'

export type UserFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: FormDrawerProps['onClose']
    onSubmitSuccess?: () => void
    roleOptions: SelectProps['options']
}

export type AddUserForm = AddUser & {
    confirmPassword?: string
}

const UserFormDrawer: React.FC<UserFormDrawerProps> = (props) => {
    const { onDrawerClose, onSubmitSuccess, roleOptions } = props
    const [drawerForm] = Form.useForm()

    const [statusRadioOptions] = useImmer([
        { value: UserStatusEnum.Enabled, label: '启用' },
        { value: UserStatusEnum.Disabled, label: '禁用' },
    ])

    const formItemsConfig = useMemo<FormItemConfig<AddUserForm>[]>(
        () => [
            {
                itemComponentProps: {
                    label: '用户名',
                    name: 'username',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入用户名',
                    allowClear: true,
                    maxLength: 20,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '邮箱',
                    name: 'email',
                    rules: [
                        { required: true },
                        {
                            type: 'email',
                            message: '请输入有效的邮箱格式',
                        },
                    ],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入邮箱',
                    allowClear: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '密码',
                    name: 'password',
                    rules: [
                        { required: true },
                        {
                            min: 6,
                            message: '密码不能少于 6 位',
                        },
                    ],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入密码',
                    allowClear: true,
                    maxLength: 50,
                    type: 'password',
                    autoComplete: 'off',
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '确认密码',
                    name: 'confirmPassword',
                    rules: [
                        { required: true },
                        {
                            min: 6,
                            message: '密码不能少于 6 位',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error('两次输入的密码不一致，请重新输入'))
                            },
                        }),
                    ],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请再次输入密码',
                    allowClear: true,
                    maxLength: 50,
                    type: 'password',
                    autoComplete: 'off',
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '用户角色',
                    name: 'roles',
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    allowClear: true,
                    options: roleOptions,
                    mode: 'multiple',
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '状态',
                    name: 'status',
                    initialValue: UserStatusEnum.Enabled,
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
        [statusRadioOptions, roleOptions],
    )

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const onFinish = (values: AddUserForm) => {
        const params = Object.assign({}, values)
        delete params.confirmPassword
        createUser(params).then(([err]) => {
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
        <FormDrawer {...props} onClose={onClose} onSubmit={onDrawerSubmit} onCancel={onCancel}>
            <DynamicForm<AddUserForm>
                formItemsConfig={formItemsConfig}
                form={drawerForm}
                onFinish={onFinish}
                name="user-drawer-form"
            ></DynamicForm>
        </FormDrawer>
    )
}

export default UserFormDrawer
