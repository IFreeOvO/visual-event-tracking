import type { Menu } from '@/models/vo/menu.vo'
import { RouteObject } from 'react-router-dom'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface Actions {
    updateMenuList: (menus: Menu[]) => void
    updateDynamicRoutes: (menus: RouteObject[]) => void
}

interface State {
    menuList: Menu[]
    actions: Actions
    dynamicRoutes: RouteObject[]
}

const useRouteStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                menuList: [],
                dynamicRoutes: [],
                actions: {
                    updateMenuList: (value: Menu[]) => {
                        set(() => ({ menuList: value }))
                    },
                    updateDynamicRoutes: (value: RouteObject[]) => {
                        set(() => ({ dynamicRoutes: value }))
                    },
                },
            }),
            {
                name: 'routeStore',
                storage: createJSONStorage(() => localStorage),
                partialize: (state) => ({
                    menuList: state.menuList,
                }),
            },
        ),
        {
            trace: import.meta.env.VITE_TRACE,
        },
    ),
)

export const useMenuList = () =>
    useRouteStore((state) => [state.menuList, state.actions.updateMenuList] as const)

export const useDynamicRoutes = () =>
    useRouteStore((state) => [state.dynamicRoutes, state.actions.updateDynamicRoutes] as const)

export default useRouteStore
