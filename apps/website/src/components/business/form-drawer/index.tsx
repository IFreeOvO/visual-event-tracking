import type {
    ActionButtonGroupProps,
    onButtonGroupClickType,
} from '@/components/business/action-button-group'
import type { DrawerProps } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { Button, Drawer, Flex } from 'antd'
import ActionButtonGroup from '@/components/business/action-button-group'

export type FormDrawerProps = Omit<DrawerProps, 'closeIcon' | 'title' | 'footer'> & {
    drawerTitle?: string
    onSubmit?: (e: React.MouseEvent | React.KeyboardEvent) => void
    onCancel?: (e: React.MouseEvent | React.KeyboardEvent) => void
}

enum FooterButtonType {
    Cancel = 'cancel',
    Confirm = 'confirm',
}

const FormDrawer: React.FC<FormDrawerProps> = memo((props) => {
    const { children, drawerTitle, onClose, onSubmit, onCancel } = props
    const [footerButtons] = useImmer<ActionButtonGroupProps['buttons']>(['cancel', 'confirm'])

    const onFooterButtonClick = useMemoizedFn<onButtonGroupClickType>((e, type) => {
        if (type === FooterButtonType.Cancel && onCancel) {
            onCancel(e)
        } else if (type === FooterButtonType.Confirm && onSubmit) {
            onSubmit(e)
        }
    })

    const title = useMemo(
        () => (
            <Flex justify="space-between" align="items-center">
                <div className="uno-flex uno-items-center">{drawerTitle}</div>
                <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
            </Flex>
        ),
        [drawerTitle, onClose],
    )

    const footer = useMemo(
        () => (
            <Flex justify="flex-end" align="items-center">
                <ActionButtonGroup
                    buttons={footerButtons}
                    onButtonGroupClick={onFooterButtonClick}
                ></ActionButtonGroup>
            </Flex>
        ),
        [footerButtons, onFooterButtonClick],
    )

    return (
        <Drawer {...props} closeIcon={false} title={title} footer={footer}>
            {children}
        </Drawer>
    )
})

export default FormDrawer
