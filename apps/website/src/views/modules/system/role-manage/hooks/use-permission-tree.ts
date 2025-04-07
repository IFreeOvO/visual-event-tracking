import type { TreeDataNode } from 'antd'
import { useToggle } from 'ahooks'
import { Key } from 'antd/es/table/interface'
import useResetImmer from '@/hooks/common/user-reset-immer'

const usePermissionTree = <TreeDataType extends TreeDataNode = TreeDataNode>() => {
    const [treeData, setTreeData] = useImmer<TreeDataType[]>([])
    const [expandedKeys, setExpandedKeys] = useImmer<number[]>([])
    const [checkedKeys, setCheckedKeys] = useImmer<number[]>([])
    const [expandableIdsCache, setExpandableIdsCache, resetExpandableIdCache] = useResetImmer<
        number[]
    >([])
    const [isExpanded, { toggle: toggleIsExpanded, setLeft: setExpanded }] = useToggle(true)
    const buttonText = useMemo(() => {
        return isExpanded ? '折叠' : '展开'
    }, [isExpanded])

    const onClickExpandBtn = () => {
        if (isExpanded) {
            setExpandedKeys([])
        } else {
            setExpandedKeys(expandableIdsCache)
        }
        toggleIsExpanded()
    }

    const onCheck = (
        checked:
            | {
                  checked: Key[]
                  halfChecked: Key[]
              }
            | Key[],
    ) => {
        if (Array.isArray(checked)) {
            setCheckedKeys(checked as number[])
        } else {
            setCheckedKeys(checked.checked as number[])
        }
    }

    const onExpand = (expandedKeys: Key[]) => {
        setExpandedKeys(expandedKeys as number[])
    }

    return {
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
    }
}

export default usePermissionTree
