import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { Action } from '@/models/vo/action.vo'
import { Form, message } from 'antd'
import { createAction } from '@/api/service/action'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'

export type ActionFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: FormDrawerProps['onClose']
    onSubmitSuccess?: () => void
}

const ActionFormDrawer: React.FC<ActionFormDrawerProps> = memo((props) => {
    const { onDrawerClose, onSubmitSuccess } = props
    const [drawerForm] = Form.useForm()

    const [formItemsConfig] = useImmer<FormItemConfig<Action>[]>([
        {
            itemComponentProps: {
                label: '行为名称',
                name: 'actionName',
                rules: [{ required: true }],
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入行为名称',
                allowClear: true,
                maxLength: 20,
            },
            colProps: {
                span: 24,
            },
        },
        {
            itemComponentProps: {
                label: '行为描述',
                name: 'actionDesc',
                rules: [{ required: true }],
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入行为描述',
                allowClear: true,
            },
            colProps: {
                span: 24,
            },
        },
    ])

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const onFinish = (values: Action) => {
        const params = Object.assign({}, values)
        createAction(params).then(([err]) => {
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
                <DynamicForm<Action>
                    formItemsConfig={formItemsConfig}
                    form={drawerForm}
                    onFinish={onFinish}
                    name="action-drawer-form"
                ></DynamicForm>
            </FormDrawer>
        </>
    )
})

export default ActionFormDrawer
