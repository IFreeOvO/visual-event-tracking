import type { Menu } from '@/models/vo/menu.vo'
import { Router } from '@remix-run/router'
import { ComponentType } from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import { LazyImport } from '@/components/common/lazy-import'
import { VisibleStatusEnum } from '@/constants/enums'
import { baseRoutes } from '@/router/base-routes'
import { useMenuList, useDynamicRoutes } from '@/store/route.store'

const useDynamicRouter = () => {
    const [, setDynamicRoutes] = useDynamicRoutes()
    const [menuList] = useMenuList()
    const [router, setRouter] = useState<Router>(createHashRouter(baseRoutes))

    useEffect(() => {
        const routes = buildRoutesBy(menuList)
        setDynamicRoutes(routes)

        setRouter(updateRouter(routes))
    }, [menuList, setRouter, setDynamicRoutes])

    return router
}

export default useDynamicRouter

function getComponentName(filePath: string) {
    const pathArr = filePath.split('/')
    return pathArr[pathArr.length - 2]
}

function getComponentMap() {
    const componentMap = new Map<string, () => Promise<{ default: ComponentType }>>()

    const modules = import.meta.glob<{ default: ComponentType }>('@/views/modules/**/index.tsx')
    const pages = Object.fromEntries(
        Object.entries(modules).filter(([path]) => !path.includes('components')),
    )

    Object.keys(pages).forEach((key) => {
        const componentName = getComponentName(key)
        componentMap.set(componentName, pages[key])
    })
    return componentMap
}
const componentMap = getComponentMap()

// 去掉路径前的斜杠
function removeLeadingSlash(path: string = '') {
    return path.replace(/^\/?/, '')
}

function makeRoute(menu: Menu, parentPath?: string): RouteObject {
    const route: RouteObject = {
        path: menu.path,
        handle: {
            title: menu.name,
            icon: menu.icon,
            fullPath: parentPath
                ? `/${removeLeadingSlash(parentPath)}/${menu.path}`
                : `/${removeLeadingSlash(menu.path)}`,
            isHidden: menu.visibleStatus === VisibleStatusEnum.Invisible,
            layout: menu.layout,
        },
    }
    if (menu.componentName) {
        const component = componentMap.get(menu.componentName)!
        route.element = <LazyImport lazy={lazy(component)}></LazyImport>
    }
    return route
}

function buildRoutesBy(dynamicMenus: Menu[] = []): RouteObject[] {
    const newRoutes: RouteObject[] = []

    const parentRouteMap = new Map<number, RouteObject>()
    dynamicMenus.forEach((menu) => {
        const isParentRoute = menu.parentId === 0
        if (isParentRoute) {
            const route = makeRoute(menu)
            newRoutes.push(route)
            parentRouteMap.set(menu.id, route)
        } else {
            if (parentRouteMap.has(menu.parentId)) {
                const parentRoute = parentRouteMap.get(menu.parentId)!
                if (!parentRoute.children) {
                    parentRoute.children = []
                }
                const route = makeRoute(menu, parentRoute.path)
                parentRoute.children.push(route)
            }
        }
    })

    return newRoutes
}

function groupByLayout(dynamicRoutes: RouteObject[]) {
    const layoutRoutes = baseRoutes[2].children!
    layoutRoutes.forEach((layoutRoute) => {
        layoutRoute.children = []
        dynamicRoutes.forEach((dynamicRoute) => {
            if (dynamicRoute.handle.layout === layoutRoute.handle.layout) {
                layoutRoute.children!.push(dynamicRoute)
            }
        })
    })
    return baseRoutes
}

function updateRouter(dynamicRoutes: RouteObject[]) {
    const routes = groupByLayout(dynamicRoutes)
    const router = createHashRouter(routes)
    return router
}
