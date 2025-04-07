import { VisibleStatusEnum } from '@/constants/enums'

const useVisibleStatusSelectOptions = () => {
    const [statusSelectOptions, setStatusSelectOptions] = useImmer([
        { value: VisibleStatusEnum.Visible, label: '显示' },
        { value: VisibleStatusEnum.Invisible, label: '隐藏' },
    ])

    return [statusSelectOptions, setStatusSelectOptions] as const
}

export default useVisibleStatusSelectOptions
