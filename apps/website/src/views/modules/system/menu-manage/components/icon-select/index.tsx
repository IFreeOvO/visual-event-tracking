import { Select, Space } from 'antd'
import { MenuIcons } from '@/constants/icons'
import useIconOptions from '../../hooks/use-icon-options'

interface IconSelectProps {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
}

const IconSelect = memo(({ value, onChange, placeholder = '请选择图标' }: IconSelectProps) => {
    const [iconOptions] = useIconOptions()

    const handleChange = (value: string) => {
        onChange?.(value)
    }

    return (
        <Select
            placeholder={placeholder}
            allowClear
            defaultValue={value}
            onChange={handleChange}
            options={iconOptions}
            optionRender={(option) => {
                const IconComponent = MenuIcons[option.data.value as keyof typeof MenuIcons]
                return (
                    <>
                        <Space>
                            {IconComponent ? <IconComponent /> : null}
                            {option.data.label}
                        </Space>
                    </>
                )
            }}
        ></Select>
    )
})

export default IconSelect
