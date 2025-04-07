import { LeftOutlined } from '@ant-design/icons'
import { Button, Flex } from 'antd'

interface NavigationProps {
    title?: string
    children?: React.ReactNode
    onBack?: () => void
}

const Navigation: React.FC<NavigationProps> = (props) => {
    const { children, title, onBack } = props
    return (
        <Flex className="uno-h-[60px]" justify="space-between" align="center">
            <Flex align="center">
                <Button onClick={onBack} color="default" variant="link">
                    <LeftOutlined />
                </Button>
                <h3>{title}</h3>
            </Flex>
            {children}
        </Flex>
    )
}
export default Navigation
