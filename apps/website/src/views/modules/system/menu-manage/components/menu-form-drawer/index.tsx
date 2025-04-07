import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { Menu } from '@/models/vo/menu.vo'
import { useMemoizedFn } from 'ahooks'
import { Form, message, Space } from 'antd'
import { createMenu, getMenus } from '@/api/service/menu'
import DynamicForm from '@/components/business/dynamic-form'
import FormDrawer, { FormDrawerProps } from '@/components/business/form-drawer'
import { VisibleStatusEnum } from '@/constants/enums'
import { MenuIcons } from '@/constants/icons'
import useResetImmer from '@/hooks/common/user-reset-immer'
import useComponentsOptions from '../../hooks/use-components-options'
import useIconOptions from '../../hooks/use-icon-options'
import useLayoutOptions from '../../hooks/use-layout-options'
import useVisibleStatusSelectOptions from '../../hooks/use-visible-select-options'

export type MenuFormDrawerProps = Omit<FormDrawerProps, 'onSubmit' | 'onClose'> & {
    onDrawerClose?: FormDrawerProps['onClose']
    onSubmitSuccess?: () => void
}

const MenuFormDrawer: React.FC<MenuFormDrawerProps> = memo((props) => {
    const { onDrawerClose, onSubmitSuccess, open } = props
    const [parentMenus, setParentMenus] = useImmer<Menu[]>([])
    const [drawerForm] = Form.useForm()
    const [iconOptions] = useIconOptions()
    const [componentsSelectOptions] = useComponentsOptions()
    const [visibleStatusSelectOptions] = useVisibleStatusSelectOptions()
    const [layoutOptions] = useLayoutOptions()

    const menuSelectOptions = useMemo(() => {
        const defaultMenu = { value: 0, label: '无父级菜单' }
        const options = [defaultMenu]
        parentMenus.forEach((menu) => {
            options.push({ value: menu.id, label: menu.name })
        })

        return options
    }, [parentMenus])
    const [parentId, setParentId, resetParentId] = useResetImmer<number>(0)

    const formItemsConfig = useMemo<FormItemConfig<Menu>[]>(
        () => [
            {
                itemComponentProps: {
                    label: '父级菜单',
                    name: 'parentId',
                    initialValue: 0,
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    options: menuSelectOptions,
                    showSearch: true,
                    optionFilterProp: 'label',
                    onChange: (value: number) => {
                        setParentId(value)
                    },
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '菜单名称',
                    name: 'name',
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入菜单名称',
                    allowClear: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '路由',
                    name: 'path',
                },
                dynamicComponentType: 'Input',
                dynamicComponentProps: {
                    placeholder: '请输入路由',
                    allowClear: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '路由组件',
                    name: 'componentName',
                    rules: [{ required: parentId !== 0 }],
                    initialValue: componentsSelectOptions[0].value,
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    showSearch: true,
                    optionFilterProp: 'label',
                    options: componentsSelectOptions,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '布局',
                    name: 'layout',
                    initialValue: layoutOptions[0].value,
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    options: layoutOptions,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '图标',
                    name: 'icon',
                    shouldUpdate: (prevValues, currentValues) => {
                        return prevValues.parentId !== currentValues.parentId
                    },
                    shouldShow: ({ getFieldValue }) => {
                        return getFieldValue('parentId') === 0
                    },
                },
                dynamicComponentType: 'Select',
                dynamicComponentProps: {
                    placeholder: '请选择图标',
                    allowClear: true,

                    options: iconOptions,
                    optionRender: (option: any) => {
                        const IconComponent = MenuIcons[option.data.value as keyof typeof MenuIcons]
                        return (
                            <>
                                <Space>
                                    {IconComponent ? <IconComponent /> : null}
                                    {option.data.label}
                                </Space>
                            </>
                        )
                    },
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '排序',
                    name: 'order',
                    initialValue: 1,
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'InputNumber',
                dynamicComponentProps: {
                    min: 1,
                    changeOnWheel: true,
                },
                colProps: {
                    span: 24,
                },
            },
            {
                itemComponentProps: {
                    label: '显示状态',
                    name: 'visibleStatus',
                    initialValue: VisibleStatusEnum.Visible,
                    rules: [{ required: true }],
                },
                dynamicComponentType: 'Radio',
                dynamicComponentProps: {
                    options: visibleStatusSelectOptions,
                },
                colProps: {
                    span: 24,
                },
            },
        ],
        [
            layoutOptions,
            componentsSelectOptions,
            iconOptions,
            menuSelectOptions,
            parentId,
            visibleStatusSelectOptions,
            setParentId,
        ],
    )

    const queryAvailableParentMenus = useMemoizedFn(async () => {
        const [err, res] = await getMenus({
            page: 1,
        })

        if (err) {
            return
        }

        const data = res.data.data ?? []
        const parentMenus = data
        setParentMenus(parentMenus)
    })

    useEffect(() => {
        if (open) {
            queryAvailableParentMenus()
        }
    }, [open, queryAvailableParentMenus])

    const onDrawerSubmit = async () => {
        drawerForm.submit()
    }

    const resetForm = () => {
        drawerForm.resetFields()
        resetParentId()
    }

    const onFinish = (values: Menu) => {
        createMenu(values).then(([err]) => {
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

    return (
        <FormDrawer {...props} onClose={onClose} onSubmit={onDrawerSubmit} onCancel={onCancel}>
            <DynamicForm<Menu>
                formItemsConfig={formItemsConfig}
                form={drawerForm}
                onFinish={onFinish}
                name="menu-drawer-form"
            ></DynamicForm>
        </FormDrawer>
    )
})

export default MenuFormDrawer
