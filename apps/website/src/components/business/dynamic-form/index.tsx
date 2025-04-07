import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import { Form, FormInstance, FormProps } from 'antd'

import DynamicFormItems from '@/components/business/dynamic-form-items'

export interface DynamicFormProps<FieldsType extends Record<string, any>> {
    formItemsConfig: FormItemConfig<FieldsType>[]
    form: FormInstance<FieldsType>
    onFinish: FormProps<FieldsType>['onFinish']
    name: string // name要必传。避免出现element id not unique问题。见https://github.com/ant-design/ant-design/issues/10218#issuecomment-504836426
}

const DynamicForm = memo(<T extends Record<string, any>>(props: DynamicFormProps<T>) => {
    const { name, formItemsConfig, form, onFinish } = props

    return (
        <Form layout="vertical" autoComplete="off" form={form} onFinish={onFinish} name={name}>
            <DynamicFormItems config={formItemsConfig}></DynamicFormItems>
        </Form>
    )
}) as <T extends Record<string, any>>(props: DynamicFormProps<T>) => JSX.Element

export default DynamicForm
