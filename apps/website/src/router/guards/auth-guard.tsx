import { useMemoizedFn } from 'ahooks'
import { ErrorBoundary } from 'react-error-boundary'
import { Path, PublicRoutes } from '@/constants/path'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import useRouter from '@/hooks/common/use-router'
import { removeAuth } from '@/shared/auth'
import { EmitterEventTypes } from '@/shared/emitter'
import { useToken } from '@/store/user.store'
import PageError from '@/views/page-error'
interface Props {
    children: React.ReactNode
}

const AuthGuard: React.FC<Props> = (props) => {
    const { children } = props
    const location = useLocation()
    const { replace } = useRouter()
    const [token] = useToken()

    const handleUnauthorized = () => {
        removeAuth()
        replace(Path.Login)
    }

    const checkAuth = useMemoizedFn(() => {
        if (!token) {
            handleUnauthorized()
        }
    })

    useEffect(() => {
        if (!PublicRoutes.includes(location.pathname as Path)) {
            checkAuth()
        }
    }, [location, token, checkAuth])

    // 监听由接口返回的未授权事件
    useEmitterListener(EmitterEventTypes.onUnAuthorized, handleUnauthorized)

    return <ErrorBoundary FallbackComponent={PageError}>{children}</ErrorBoundary>
}

export default AuthGuard
