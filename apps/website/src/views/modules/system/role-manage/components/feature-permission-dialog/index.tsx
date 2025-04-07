import type { FeaturePermissionTreeData } from '@/models/vo/permission.vo'
import type { ModalProps } from 'antd'
import { useMemoizedFn } from 'ahooks'
import { Button, Modal, Tree } from 'antd'
import { getFeaturePermissions } from '@/api/service/permission'
import { getRoleFeaturePermissions } from '@/api/service/role'
import usePermissionTree from '../../hooks/use-permission-tree'

export interface FeaturePermissionDialogProps {
    roleId: number
    isOpen: boolean
    onOk: (roleId: number, checkedKeys: number[]) => void
    onCancel?: ModalProps['onCancel']
}

const FeaturePermissionDialog = memo((props: FeaturePermissionDialogProps) => {
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
    } = usePermissionTree<FeaturePermissionTreeData>()

    const handleOk = () => {
        onOk(roleId, checkedKeys)
    }

    const queryAllPermissions = useMemoizedFn(async () => {
        const [err, res] = await getFeaturePermissions()

        if (err) {
            return
        }

        const ids: number[] = []
        const data = res.data ?? []
        const treedata = data.map((node) => {
            if (node.children) {
                node.disabled = true
                ids.push(node.key)
            }
            return node
        })
        setExpandableIdsCache(ids)
        setExpandedKeys(ids)

        setTreeData(treedata)

        getCheckedNodes()
    })

    const getCheckedNodes = async () => {
        const [err, res] = await getRoleFeaturePermissions(roleId)
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
            queryAllPermissions()
        }
    }, [isOpen, queryAllPermissions, setExpanded, resetExpandableIdCache])

    return (
        <Modal title="编辑功能权限" open={isOpen} onOk={handleOk} onCancel={onCancel}>
            <Button color="primary" variant="outlined" size="small" onClick={onClickExpandBtn}>
                {buttonText}
            </Button>
            <div className="uno-h-[400px] uno-overflow-y-auto uno-mt-[8px]">
                <Tree
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
})

export default FeaturePermissionDialog
