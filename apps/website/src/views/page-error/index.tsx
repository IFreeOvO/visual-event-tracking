import { Button, Result } from 'antd'
import { FallbackProps } from 'react-error-boundary'
import { Path } from '@/constants/path'
import useRouter from '@/hooks/common/use-router'
import { removeAuth } from '@/shared/auth'

const PageError: React.FC<FallbackProps> = ({ resetErrorBoundary }) => {
    const { replace } = useRouter()

    const onClickBtn = () => {
        removeAuth()
        resetErrorBoundary()
        replace(Path.Login)
    }
    return (
        <Result
            status="error"
            title="页面出现错误"
            subTitle=""
            extra={
                <Button type="primary" onClick={onClickBtn}>
                    重新登录
                </Button>
            }
        />
    )
}

export default PageError
