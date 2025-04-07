import { LayoutEnum } from '@/constants/enums'

const useLayoutOptions = () => {
    const [options, setOptions] = useImmer([
        { value: LayoutEnum.Default, label: 'Default' },
        { value: LayoutEnum.Blank, label: 'Blank' },
    ])

    return [options, setOptions] as const
}

export default useLayoutOptions
