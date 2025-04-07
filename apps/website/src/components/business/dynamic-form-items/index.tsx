import type { ActionButtonGroupProps } from '@/components/business/action-button-group'
import type {
    CheckboxProps,
    ColProps,
    FormItemProps,
    InputNumberProps,
    InputProps,
    RadioGroupProps,
    RowProps,
    SelectProps,
    GetProps,
} from 'antd'
import { useMemoizedFn } from 'ahooks'
import { Form, Input, Select, Radio, InputNumber, Row, Col, Checkbox, DatePicker } from 'antd'
import ActionButtonGroup from '@/components/business/action-button-group'
const { RangePicker } = DatePicker

export type FormComponentType =
    | 'Input'
    | 'Select'
    | 'Radio'
    | 'Checkbox'
    | 'ActionButtonGroup'
    | 'InputNumber'
    | 'RangePicker'

export interface ComponentPropsMap {
    Input: InputProps
    Select: SelectProps
    Radio: RadioGroupProps
    Checkbox: CheckboxProps
    InputNumber: InputNumberProps
    ActionButtonGroup: ActionButtonGroupProps
    RangePicker: GetProps<typeof DatePicker.RangePicker>
}

export interface FormItemConfig<FieldType extends Record<string, any>> {
    key?: string | number
    itemComponentProps?: FormItemProps & {
        name?: keyof FieldType
        shouldShow?: ({
            getFieldValue,
        }: {
            getFieldValue: (name: keyof FieldType) => any
        }) => boolean // 控制组件显示隐藏
    }
    dynamicComponentType: FormComponentType
    dynamicComponentProps?: ComponentPropsMap[FormItemConfig<FieldType>['dynamicComponentType']]
    colProps?: ColProps
}

export type DynamicFormItemsProps<FieldType extends Record<string, any> = any> = {
    config: FormItemConfig<FieldType>[]
    rowProps?: RowProps
}

const DynamicFormItems = <FieldType extends Record<string, any>>(
    props: DynamicFormItemsProps<FieldType>,
) => {
    const { config, rowProps } = props

    const renderComponent = useMemoizedFn(
        <ComponentType extends FormComponentType>(
            componentType: ComponentType,
            componentProps: Partial<ComponentPropsMap[ComponentType]> = {},
        ) => {
            const componentMap: {
                [K in FormComponentType]: React.ReactElement<ComponentPropsMap[K]>
            } = {
                Input: <Input {...componentProps} />,
                Select: <Select {...componentProps} />,
                Radio: <Radio.Group {...componentProps}></Radio.Group>,
                Checkbox: <Checkbox.Group {...componentProps}></Checkbox.Group>,
                InputNumber: <InputNumber {...componentProps} />,
                ActionButtonGroup: <ActionButtonGroup {...componentProps} />,
                RangePicker: <RangePicker {...componentProps} />,
            }
            return componentMap[componentType]
        },
    )

    const renderFormItem = (item: FormItemConfig<FieldType>) => {
        // 删除自定义的shouldShow属性。不然antd的Form.Item会报错
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { shouldShow, ...restComponentProps } = Object.assign({}, item.itemComponentProps)

        return (
            <Form.Item<FieldType> {...restComponentProps}>
                {renderComponent(item.dynamicComponentType, item.dynamicComponentProps)}
            </Form.Item>
        )
    }

    const customUpdateComponent = (item: FormItemConfig<FieldType>) => {
        return (
            <Form.Item noStyle shouldUpdate={item.itemComponentProps?.shouldUpdate}>
                {({ getFieldValue }) =>
                    item.itemComponentProps?.shouldShow?.({ getFieldValue })
                        ? renderFormItem(item)
                        : null
                }
            </Form.Item>
        )
    }

    return (
        <>
            <Row {...rowProps}>
                {config.map((item, i) => (
                    <Col {...item.colProps} key={item.key ?? item.itemComponentProps?.name ?? i}>
                        {item.itemComponentProps?.shouldUpdate !== undefined
                            ? customUpdateComponent(item)
                            : renderFormItem(item)}
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default DynamicFormItems
