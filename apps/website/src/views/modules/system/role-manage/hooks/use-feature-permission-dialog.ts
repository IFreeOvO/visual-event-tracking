import { useMemoizedFn, useToggle } from 'ahooks'
import { message } from 'antd'
import { savePermissions } from '@/api/service/role'
import { PermissionTypeEnum } from '@/constants/enums'

const useFeaturePermissionDialog = () => {
    const [isFeatureModalOpen, { toggle: toggleFeatureModalOpen }] = useToggle()

    const onFeatureModalOk = useMemoizedFn((roleId: number, checkedKeys: number[]) => {
        savePermissions({
            roleId: roleId,
            permissionIds: checkedKeys,
            type: PermissionTypeEnum.Api,
        }).then(([err]) => {
            if (!err) {
                message.open({
                    content: '保存成功',
                    type: 'success',
                })
                toggleFeatureModalOpen()
            }
        })
    })

    return {
        isFeatureModalOpen,
        toggleFeatureModalOpen,
        onFeatureModalOk,
    }
}

export default useFeaturePermissionDialog
