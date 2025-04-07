import { MenuProps } from 'antd'
import { cloneDeep } from 'lodash-es'
import { RouteObject } from 'react-router-dom'
import { LazyImport } from '@/components/common/lazy-import'
import { useDynamicRoutes } from '@/store/route.store'

const iconMap = {
    HomeOutlined: () => import('@ant-design/icons/HomeOutlined'),
    AppstoreOutlined: () => import('@ant-design/icons/AppstoreOutlined'),
    DotChartOutlined: () => import('@ant-design/icons/DotChartOutlined'),
}

const useMenuItems = () => {
    const [dynamicRoutes] = useDynamicRoutes()
    const [menuItems, setMenuItems] = useImmer<MenuProps['items']>([])

    useEffect(() => {
        const visibleRoutes = getVisibleRoutes(cloneDeep(dynamicRoutes))
        setMenuItems(menuItemsFrom(visibleRoutes))
    }, [dynamicRoutes, setMenuItems])

    return menuItems
}

export default useMenuItems

function getVisibleRoutes(routes: RouteObject[]): RouteObject[] {
    const visibleParentRoutes = routes.filter((item) => !item.handle.isHidden)
    visibleParentRoutes.forEach((parentRoutes) => {
        if (parentRoutes.children) {
            parentRoutes.children = parentRoutes.children.filter((item) => !item.handle.isHidden)
        }
    })

    return visibleParentRoutes
}

function menuItemsFrom(routes: RouteObject[]): MenuProps['items'] {
    const menuItems = routes.map((route) => {
        const icon: keyof typeof iconMap = route.handle?.icon
        const menuItem = {
            key: route.handle?.fullPath,
            icon: icon ? (
                <LazyImport fallback={null} lazy={lazy(iconMap[icon])}></LazyImport>
            ) : undefined,
            label: route.handle?.title,
            children: route.children ? menuItemsFrom(route.children) : undefined,
        }
        if (!menuItem.icon) {
            delete menuItem.icon
        }
        if (!menuItem.children) {
            delete menuItem.children
        }

        return menuItem
    })

    return menuItems
}
