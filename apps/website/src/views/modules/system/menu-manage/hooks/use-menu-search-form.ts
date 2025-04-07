import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchMenuForm } from '@/models/dto/menu.dto'
import useSearchForm from '@/hooks/business/use-search-form'

const useMenuSearchForm = () => {
    const [formItemList] = useImmer<FormItemConfig<SearchMenuForm>[]>([
        {
            itemComponentProps: {
                label: '菜单名称',
                name: 'name',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入菜单名称',
                allowClear: true,
            },
        },
    ])

    const { searchForm, formData, formProps, formItems, setFormData } =
        useSearchForm<SearchMenuForm>(formItemList)

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
    }
}

export default useMenuSearchForm
