import type { FormItemConfig } from '@/components/business/dynamic-form-items'
import { useMemoizedFn } from 'ahooks'
import { Form, FormProps } from 'antd'
import {
    ActionButtonGroupProps,
    onButtonGroupClickType,
} from '@/components/business/action-button-group'
import { FormButtonEnum } from '@/constants/enums'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

const useSearchForm = <FormDataType extends Record<string, any>>(
    formItemList: FormItemConfig<FormDataType>[] = [],
) => {
    const [searchForm] = Form.useForm()
    const [formData, setFormData] = useImmer<FormDataType>({} as FormDataType)
    const [formButtons] = useImmer<ActionButtonGroupProps['buttons']>(['reset', 'search'])

    const [formProps, setFormProps] = useImmer<FormProps>({
        colon: false,
        autoComplete: 'off',
        labelCol: { span: 7 },
        wrapperCol: { span: 17 },
        onFinish: (values: FormDataType) => {
            emitter.emit(EmitterEventTypes.onSearchFinish, values)
        },
    })

    const onFormButtonClick = useMemoizedFn<onButtonGroupClickType>((_, type) => {
        if (type === FormButtonEnum.Reset) {
            searchForm.resetFields()
        }
    })

    const formItems = useMemo(() => {
        const searchFormItemsConfig: FormItemConfig<FormDataType>[] = [
            ...formItemList,
            {
                itemComponentProps: {
                    label: ' ',
                },
                dynamicComponentType: 'ActionButtonGroup',
                dynamicComponentProps: {
                    buttons: formButtons,
                    onButtonGroupClick: onFormButtonClick,
                    wrap: false,
                },
            },
        ]
        return searchFormItemsConfig
    }, [formButtons, onFormButtonClick, formItemList])

    return {
        searchForm,
        formData,
        formProps,
        formItems,
        setFormData,
        setFormProps,
    }
}

export default useSearchForm
