import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchRoleForm } from '@/models/dto/role.dto'
import { RoleStatusEnum } from '@/constants/enums'
import useSearchForm from '@/hooks/business/use-search-form'

const useRoleSearchForm = () => {
    const [statusSelectOptions] = useImmer([
        { value: RoleStatusEnum.Enabled, label: '启用' },
        { value: RoleStatusEnum.Disabled, label: '禁用' },
    ])

    const [formItemList] = useImmer<FormItemConfig<SearchRoleForm>[]>([
        {
            itemComponentProps: {
                label: '角色名称',
                name: 'roleName',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入角色名称',
                allowClear: true,
            },
        },
        {
            itemComponentProps: {
                label: '角色描述',
                name: 'roleDesc',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入角色描述',
                allowClear: true,
            },
        },
        {
            itemComponentProps: {
                label: '状态',
                name: 'status',
            },
            dynamicComponentType: 'Select',
            dynamicComponentProps: {
                placeholder: '请选择状态',
                allowClear: true,
                options: statusSelectOptions,
            },
        },
    ])

    const { searchForm, formData, formProps, formItems, setFormData } =
        useSearchForm<SearchRoleForm>(formItemList)

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
    }
}

export default useRoleSearchForm
