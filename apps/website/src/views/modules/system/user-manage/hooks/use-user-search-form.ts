import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchUserForm } from '@/models/dto/user.dto'
import { UserStatusEnum } from '@/constants/enums'
import useSearchForm from '@/hooks/business/use-search-form'

const useUserSearchForm = () => {
    const [statusSelectOptions] = useImmer([
        { value: UserStatusEnum.Enabled, label: '启用' },
        { value: UserStatusEnum.Disabled, label: '禁用' },
    ])

    const [formItemList] = useImmer<FormItemConfig<SearchUserForm>[]>([
        {
            itemComponentProps: {
                label: '用户名',
                name: 'username',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入用户名',
                allowClear: true,
            },
        },
        {
            itemComponentProps: {
                label: '邮箱',
                name: 'email',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入邮箱',
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
        useSearchForm<SearchUserForm>(formItemList)

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
    }
}

export default useUserSearchForm
