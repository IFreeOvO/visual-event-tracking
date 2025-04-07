import type { ActionButtonGroupProps } from '@/components/business/action-button-group'
import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { EditableProTableProps, ProColumns } from '@ant-design/pro-components'
import type { CollapseProps, FormInstance, FormProps } from 'antd'
import type { ColProps } from 'antd'
import { EditableProTable } from '@ant-design/pro-components'
import { Card, Collapse, Flex, Form, theme } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { cloneDeep } from 'lodash-es'
import ActionButtonGroup from '@/components/business/action-button-group'
import DynamicFormItems from '@/components/business/dynamic-form-items'

export const EDITABLE_TABLE_ID = 'edit-table-container'

export interface FormAndTableLayoutProps<
    TableDataSourceType,
    FieldType extends Record<string, any>,
> {
    toolButtons: ActionButtonGroupProps['buttons']
    form: FormInstance<FieldType>
    title?: string
    tableProps?: EditableProTableProps<TableDataSourceType, any>
    columns?: ProColumns<TableDataSourceType>[]
    dataSource?: TableDataSourceType[]
    formProps?: FormProps
    formItems: FormItemConfig<FieldType>[]
    onToolButtonClick?: ActionButtonGroupProps['onButtonGroupClick']
}

const SearchForm = memo(
    <FieldType extends Record<string, any>>(
        props: Pick<FormAndTableLayoutProps<any, FieldType>, 'form' | 'formProps' | 'formItems'>,
    ) => {
        const { form, formProps, formItems } = props
        const formItemsConfig = useMemo(() => {
            const configs: FormItemConfig<FieldType>[] = cloneDeep(formItems ?? [])
            configs.forEach((config) => {
                config.colProps = {
                    xl: 6,
                    md: 12,
                    sm: 24,
                    xs: 24,
                    ...config.colProps,
                } as ColProps
            })
            return configs
        }, [formItems])

        return (
            <Form {...formProps} form={form}>
                <DynamicFormItems<FieldType>
                    config={formItemsConfig}
                    rowProps={{
                        gutter: {
                            xl: 16,
                            md: 16,
                        },
                    }}
                ></DynamicFormItems>
            </Form>
        )
    },
) as <FieldType extends Record<string, any>>(
    props: Pick<FormAndTableLayoutProps<any, FieldType>, 'form' | 'formProps' | 'formItems'>,
) => JSX.Element

const FormAndTableLayout = memo(
    <TableDataSourceType extends AnyObject, FieldType extends Record<string, any>>(
        props: FormAndTableLayoutProps<TableDataSourceType, FieldType>,
    ) => {
        const {
            toolButtons,
            form,
            formProps,
            formItems,
            tableProps = {},
            title,
            columns = [],
            dataSource = [],
            onToolButtonClick,
        } = props
        const { token } = theme.useToken()

        const items: CollapseProps['items'] = useMemo(() => {
            return [
                {
                    key: '1',
                    label: '搜索',
                    children: (
                        <SearchForm form={form} formProps={formProps} formItems={formItems} />
                    ),
                },
            ]
        }, [form, formProps, formItems])

        return (
            <Flex vertical gap="middle" id="form-and-table-layout" className="uno-h-full ">
                {/* 表单查询区 */}
                <Collapse
                    className="uno-flex-shrink-0"
                    items={items}
                    defaultActiveKey={['1']}
                    ghost
                    style={{ background: token.colorBgBase, boxShadow: token.boxShadowTertiary }}
                />
                {/* 表格展示区 */}
                <Card
                    title={title}
                    extra={
                        <ActionButtonGroup
                            buttons={toolButtons}
                            onButtonGroupClick={onToolButtonClick}
                        ></ActionButtonGroup>
                    }
                    className="uno-flex-1 uno-flex uno-flex-col uno-h-0"
                    classNames={{
                        header: 'uno-flex-shrink-0',
                        body: 'uno-flex-1 uno-h-0 uno-flex',
                    }}
                    variant="outlined"
                >
                    <div className="uno-flex-1 uno-overflow-hidden" id={EDITABLE_TABLE_ID}>
                        <EditableProTable<TableDataSourceType>
                            columns={columns}
                            value={dataSource}
                            {...tableProps}
                        ></EditableProTable>
                    </div>
                </Card>
            </Flex>
        )
    },
) as <TableDataSourceType extends AnyObject, FieldType extends Record<string, any>>(
    props: FormAndTableLayoutProps<TableDataSourceType, FieldType>,
) => JSX.Element

export default FormAndTableLayout
