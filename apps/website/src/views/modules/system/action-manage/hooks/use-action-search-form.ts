import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchActionForm } from '@/models/dto/action.dto'
import useSearchForm from '@/hooks/business/use-search-form'

const useUserSearchForm = () => {
    const [formItemList] = useImmer<FormItemConfig<SearchActionForm>[]>([
        {
            itemComponentProps: {
                label: '描述',
                name: 'actionDesc',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入描述',
                allowClear: true,
            },
        },
    ])

    const { searchForm, formData, formProps, formItems, setFormData } =
        useSearchForm<SearchActionForm>(formItemList)

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
    }
}

export default useUserSearchForm
