import { Card } from 'antd'
import { Suspense } from 'react'
import Loading from '@/components/common/loading'

const AuthLayout: React.FC = () => {
    return (
        <div
            id="auth-layout"
            className="uno-center uno-h-full uno-bg-[linear-gradient(120deg,#e0c3fc_0%,#8ec5fc_100%)]"
        >
            <Card className="uno-w-400px">
                <h3 className="uno-text-primary uno-text-28px uno-text-center">可视化埋点系统</h3>
                <Suspense fallback={<Loading />}>
                    <Outlet></Outlet>
                </Suspense>
            </Card>
        </div>
    )
}

export default AuthLayout
