import { Select, SelectProps } from 'antd'

interface MultiSelectProps<T> {
    defaultValue?: T[]
    value?: T[]
    onChange?: (value: T[]) => void
    roleOptions?: SelectProps['options']
}

const MultiSelect = memo(<T = any,>(props: MultiSelectProps<T>) => {
    const { defaultValue = [], onChange, roleOptions } = props

    const handleChange = (newValue: T[]) => {
        onChange?.(newValue)
    }

    return (
        <Select<T[]>
            mode="multiple"
            allowClear
            options={roleOptions}
            defaultValue={defaultValue}
            onChange={handleChange}
        ></Select>
    )
}) as <T = any>(props: MultiSelectProps<T>) => JSX.Element

export default MultiSelect
