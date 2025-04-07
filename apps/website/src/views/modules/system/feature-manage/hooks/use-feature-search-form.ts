import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import type { SearchFeatureForm } from '@/models/dto/feature.dto'
import useSearchForm from '@/hooks/business/use-search-form'

const useFeatureSearchForm = () => {
    const [formItemList] = useImmer<FormItemConfig<SearchFeatureForm>[]>([
        {
            itemComponentProps: {
                label: '描述',
                name: 'subjectDesc',
            },
            dynamicComponentType: 'Input',
            dynamicComponentProps: {
                placeholder: '请输入描述',
                allowClear: true,
            },
        },
    ])

    const { searchForm, formData, formProps, formItems, setFormData } =
        useSearchForm<SearchFeatureForm>(formItemList)

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
    }
}

export default useFeatureSearchForm
