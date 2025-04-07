import { PermissionStatusEnum } from '@/constants/enums'

const useStatusSelectOptions = () => {
    const [statusSelectOptions, setStatusSelectOptions] = useImmer([
        { value: PermissionStatusEnum.Enabled, label: '启用' },
        { value: PermissionStatusEnum.Disabled, label: '禁用' },
    ])

    return [statusSelectOptions, setStatusSelectOptions] as const
}

export default useStatusSelectOptions
