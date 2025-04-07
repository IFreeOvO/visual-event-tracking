import { SelectOutlined } from '@ant-design/icons'
import { Button, Flex, Space, theme } from 'antd'
import AddressBar from '@/components/business/address-bar'

interface EditorHeaderProps {
    url?: string
    disableForward?: boolean
    disableBack?: boolean
    isSelectInspector?: boolean
    onBack?: () => void
    onForward?: () => void
    onSearch?: (value: string) => void
    onClickInspector?: () => void
}

const EditorHeader: React.FC<EditorHeaderProps> = (props) => {
    const { isSelectInspector, onClickInspector } = props
    const {
        token: { colorPrimaryHover },
    } = theme.useToken()

    const HandleClickInspector = () => {
        onClickInspector && onClickInspector()
    }

    return (
        <Flex
            justify="space-between"
            align="center"
            className="uno-h-[50px] uno-my-[16px] uno-bg-[#e0e8ff] uno-rounded-[6px] uno-px-[16px]"
        >
            <AddressBar {...props}></AddressBar>
            <Space>
                <Button
                    className={
                        isSelectInspector ? '' : ' !hover:uno-text-black/88 !uno-border-#d9d9d9'
                    }
                    style={{
                        color: isSelectInspector ? colorPrimaryHover : undefined,
                        borderColor: isSelectInspector ? colorPrimaryHover : undefined,
                    }}
                    icon={<SelectOutlined />}
                    onClick={HandleClickInspector}
                >
                    选取埋点
                </Button>
            </Space>
        </Flex>
    )
}

export default EditorHeader
