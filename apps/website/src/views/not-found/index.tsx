import { Button, Result } from 'antd'
import { Path } from '@/constants/path'

const NotFound: React.FC = () => {
    return (
        <Result
            status="404"
            title="404"
            subTitle="页面不存在"
            extra={
                <Link to={Path.Login}>
                    <Button type="primary">重新登录</Button>
                </Link>
            }
        />
    )
}

export default NotFound
