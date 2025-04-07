import { BreadcrumbProps } from 'antd'
import { RouteObject } from 'react-router-dom'
import { useDynamicRoutes } from '@/store/route.store'

const useBreadcrumb = () => {
    const [breadcrumb, setBreadcrumb] = useImmer<BreadcrumbProps['items']>([])
    const location = useLocation()

    const [dynamicRoutes] = useDynamicRoutes()

    useEffect(() => {
        const path = location.pathname
        setBreadcrumb(breadcrumbFrom(dynamicRoutes, path))
    }, [location, dynamicRoutes, setBreadcrumb])

    return breadcrumb
}

export default useBreadcrumb

function breadcrumbFrom(routes: RouteObject[], path: string): BreadcrumbProps['items'] {
    const breadcrumb: BreadcrumbProps['items'] = []
    const parentRoute = routes.find((route) => path.includes(route.handle.fullPath))
    if (parentRoute) {
        breadcrumb.push({
            title: parentRoute.handle.title,
        })

        if (parentRoute.children) {
            const childRoute = parentRoute.children.find((route) =>
                path.includes(route.handle.fullPath),
            )
            if (childRoute) {
                breadcrumb.push({
                    title: childRoute.handle.title,
                })
            }
        }
    }

    return breadcrumb
}
