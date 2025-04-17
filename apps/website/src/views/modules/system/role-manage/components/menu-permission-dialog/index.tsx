import type { MenuPermissionTreeData } from '@/models/vo/permission.vo'
import type { ModalProps } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { Button, Modal, Tree } from 'antd'
import { getMenuPermissions } from '@/api/service/permission'
import { getRoleMenuPermissions } from '@/api/service/role'
import usePermissionTree from '../../hooks/use-permission-tree'
export interface MenuPermissionDialogProps {
    roleId: number
    isOpen: boolean
    onOk: (roleId: number, checkedKeys: number[]) => void
    onCancel?: ModalProps['onCancel']
}

const MenuPermissionDialog: React.FC<MenuPermissionDialogProps> = (props) => {
    const { roleId, isOpen, onOk, onCancel } = props
    const {
        treeData,
        expandedKeys,
        checkedKeys,
        buttonText,
        setCheckedKeys,
        setTreeData,
        setExpandableIdsCache,
        resetExpandableIdCache,
        setExpanded,
        setExpandedKeys,
        onClickExpandBtn,
        onCheck,
        onExpand,
    } = usePermissionTree<MenuPermissionTreeData>()

    const handleOk = () => {
        onOk(roleId, checkedKeys)
    }

    const queryAvailableMenus = useMemoizedFn(async () => {
        const [err, res] = await getMenuPermissions()

        if (err) {
            return
        }

        const ids: number[] = []
        const data = res.data ?? []
        const menus = data.map((menu) => {
            if (menu.children) {
                ids.push(menu.key)
            }
            return menu
        })
        setExpandableIdsCache(ids)
        setExpandedKeys(ids)

        setTreeData(menus)

        getCheckedNodes()
    })

    const getCheckedNodes = async () => {
        const [err, res] = await getRoleMenuPermissions(roleId)
        if (err) {
            return
        }

        const checkIds = res.data.map((item) => item.id)
        setCheckedKeys(checkIds)
    }

    useEffect(() => {
        if (isOpen) {
            setExpanded()
            resetExpandableIdCache()
            queryAvailableMenus()
        }
    }, [isOpen, queryAvailableMenus, setExpanded, resetExpandableIdCache])

    return (
        <Modal title="编辑菜单权限" open={isOpen} onOk={handleOk} onCancel={onCancel}>
            <Button color="primary" variant="outlined" size="small" onClick={onClickExpandBtn}>
                {buttonText}
            </Button>
            <div className="uno-h-[400px] uno-overflow-y-auto uno-mt-[8px]">
                <Tree
                    checkStrictly={true}
                    checkable
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={onCheck}
                    treeData={treeData}
                />
            </div>
        </Modal>
    )
}

export default MenuPermissionDialog
