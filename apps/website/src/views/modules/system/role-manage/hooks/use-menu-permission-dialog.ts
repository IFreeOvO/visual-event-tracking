import { useMemoizedFn, useToggle } from 'ahooks'
import { message } from 'antd'
import { savePermissions } from '@/api/service/role'
import { PermissionTypeEnum } from '@/constants/enums'
import useMenuRefresh from '@/hooks/business/use-menu-items'

const useMenuPermissionDialog = () => {
    const refreshMenuItems = useMenuRefresh()

    const [isMenuModalOpen, { toggle: toggleMenuModalOpen }] = useToggle()

    const onMenuModalOk = useMemoizedFn((roleId: number, checkedKeys: number[]) => {
        savePermissions({
            roleId: roleId,
            permissionIds: checkedKeys,
            type: PermissionTypeEnum.Menu,
        }).then(([err]) => {
            if (!err) {
                refreshMenuItems()
                message.open({
                    content: '保存成功',
                    type: 'success',
                })
                toggleMenuModalOpen()
            }
        })
    })

    return {
        isMenuModalOpen,
        toggleMenuModalOpen,
        onMenuModalOk,
    }
}

export default useMenuPermissionDialog
