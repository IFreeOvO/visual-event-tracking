import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchPermissionForm } from '@/models/dto/permission.dto'
import useSearchForm from '@/hooks/business/use-search-form'
import useStatusSelectOptions from './use-status-options'
import useTypeSelectOptions from './use-type-select-options'

const usePermissionSearchForm = () => {
    const [typeSelectOptions] = useTypeSelectOptions()
    const [statusSelectOptions] = useStatusSelectOptions()

    const [formItemList] = useImmer<FormItemConfig<SearchPermissionForm>[]>([
        {
            itemComponentProps: {
                label: '权限编码',
                name: 'permissionCode',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入权限编码',
                allowClear: true,
            },
        },
        {
            itemComponentProps: {
                label: '权限类型',
                name: 'permissionType',
            },
            dynamicComponentType: 'Select',
            dynamicComponentProps: {
                placeholder: '请选择权限类型',
                allowClear: true,
                options: typeSelectOptions,
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
        useSearchForm<SearchPermissionForm>(formItemList)

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
    }
}

export default usePermissionSearchForm
