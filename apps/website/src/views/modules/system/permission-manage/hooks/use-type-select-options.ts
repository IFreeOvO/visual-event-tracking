import { PermissionTypeEnum } from '@/constants/enums'

const useTypeSelectOptions = () => {
    const [typeSelectOptions, setTypeSelectOptions] = useImmer([
        { value: PermissionTypeEnum.Menu, label: '菜单' },
        { value: PermissionTypeEnum.Api, label: '接口' },
    ])

    return [typeSelectOptions, setTypeSelectOptions] as const
}

export default useTypeSelectOptions
