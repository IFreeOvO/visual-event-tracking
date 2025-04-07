import { getUserMenuList } from '@/api/service/user'
import { Menu } from '@/models/vo/menu.vo'
import { useMenuList } from '@/store/route.store'

const useMenuRefresh = () => {
    const [, setMenuList] = useMenuList()

    const refreshMenuItems = async () => {
        const [menuErr, menuRes] = await getUserMenuList()
        if (menuErr) {
            return
        }
        const menus: Menu[] = menuRes.data
        setMenuList(menus)
        return menus
    }

    return refreshMenuItems
}

export default useMenuRefresh
