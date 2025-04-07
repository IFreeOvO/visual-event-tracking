import { SmileOutlined } from '@ant-design/icons'
import { Result } from 'antd'
const Home: React.FC = () => {
    return (
        <div>
            <Result icon={<SmileOutlined />} title="欢迎使用" />
        </div>
    )
}

export default Home
