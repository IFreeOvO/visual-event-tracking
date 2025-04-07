import { RouteObject } from 'react-router-dom'
import { LazyImport } from '@/components/common/lazy-import'
import { LayoutEnum } from '@/constants/enums'
import { Path } from '@/constants/path'
import AuthLayout from '@/layouts/auth-layout'
import BlankLayout from '@/layouts/blank-layout'
import DefaultLayout from '@/layouts/default-layout'
import NotFound from '@/views/not-found'
import AuthGuard from './guards/auth-guard'

export const baseRoutes: RouteObject[] = [
    {
        path: '',
        element: <Navigate to={Path.Login} replace />,
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <AuthLayout></AuthLayout>
            </AuthGuard>
        ),

        children: [
            {
                path: Path.Login,
                element: <LazyImport lazy={lazy(() => import('@/views/login'))}></LazyImport>,
            },
            {
                path: Path.Register,
                element: <LazyImport lazy={lazy(() => import('@/views/register'))}></LazyImport>,
            },
        ],
    },
    {
        path: '/',
        element: (
            <AuthGuard>
                <Outlet></Outlet>
            </AuthGuard>
        ),
        children: [
            {
                element: <DefaultLayout></DefaultLayout>,
                handle: {
                    layout: LayoutEnum.Default,
                },
                children: [],
            },
            {
                element: <BlankLayout></BlankLayout>,
                handle: {
                    layout: LayoutEnum.Blank,
                },
                children: [],
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]
