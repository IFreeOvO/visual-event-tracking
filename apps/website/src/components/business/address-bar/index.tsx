import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Space } from 'antd'
const { Search } = Input

interface AddressBarProps {
    url?: string
    disableForward?: boolean
    disableBack?: boolean
    onBack?: () => void
    onForward?: () => void
    onSearch?: (value: string) => void
    readOnly?: boolean
}

const AddressBar: React.FC<AddressBarProps> = (props) => {
    const { url, disableForward, disableBack, onSearch, onForward, onBack, readOnly = true } = props

    const handleSearch = (value: string) => {
        onSearch && onSearch(value)
    }

    const handleBack = () => {
        onBack && onBack()
    }

    const handleForward = () => {
        onForward && onForward()
    }

    return (
        <Flex align="center" className="uno-h-[40px] ">
            <Space>
                <Button
                    disabled={disableBack}
                    className="uno-px-[10px] uno-bg-white!"
                    onClick={handleBack}
                >
                    <LeftOutlined />
                </Button>
                <Button
                    disabled={disableForward}
                    className="uno-px-[10px] uno-bg-white!"
                    onClick={handleForward}
                >
                    <RightOutlined />
                </Button>
                <Search
                    onSearch={handleSearch}
                    readOnly={readOnly}
                    value={url}
                    style={{ width: 400 }}
                />
            </Space>
        </Flex>
    )
}

export default AddressBar
