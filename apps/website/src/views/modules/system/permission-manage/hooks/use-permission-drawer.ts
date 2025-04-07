import type { Menu } from '@/models/vo/menu.vo'
import { useMemoizedFn, useMount, useToggle } from 'ahooks'
import { SelectProps } from 'antd'
import { getFeatures } from '@/api/service/feature'
import { getMenus } from '@/api/service/menu'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

const usePermissionDrawer = () => {
    const [drawerTitle] = useImmer('新增权限')
    const [isOpenDrawer, { toggle: toggleDrawerState }] = useToggle()
    const onDrawerSubmitSuccess = useMemoizedFn(() => {
        emitter.emit(EmitterEventTypes.onDrawerSubmitSuccess)
    })

    const [menuOptions, setMenuOptions] = useImmer<SelectProps['options']>([])
    const [featureOptions, setFeatureOptions] = useImmer<SelectProps['options']>([])

    const queryAllMenus = useMemoizedFn(async () => {
        const [err, res] = await getMenus({
            page: 1,
        })

        if (err) {
            return
        }

        const data = res.data.data ?? []
        const menus: SelectProps['options'] = data.reduce(
            (menu: SelectProps['options'] = [], item) => {
                if (item.children) {
                    menu.push(...menuToOptions(item.children))
                    delete item.children
                    menu.push(...menuToOptions([item]))
                } else {
                    menu.push(...menuToOptions([item]))
                }
                return menu
            },
            [],
        )
        setMenuOptions(menus)
    })

    const queryAllFeatures = useMemoizedFn(async () => {
        const [err, res] = await getFeatures({
            page: 1,
        })
        if (err) {
            return
        }

        const data = res.data.data ?? []
        const options: SelectProps['options'] = data.map((item) => {
            return {
                value: item.id,
                label: item.subjectDesc,
            }
        })
        setFeatureOptions(options)
    })

    useMount(() => {
        queryAllMenus()
        queryAllFeatures()
    })

    return {
        featureOptions,
        menuOptions,
        isOpenDrawer,
        drawerTitle,
        toggleDrawerState,
        onDrawerSubmitSuccess,
    }
}

export default usePermissionDrawer

function menuToOptions(menuList: Menu[]) {
    return menuList.map((childMenu) => ({
        value: childMenu.id,
        label: childMenu.name,
    }))
}
