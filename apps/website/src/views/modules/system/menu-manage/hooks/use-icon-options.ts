import { memoize } from 'lodash-es'
import { ForwardRefExoticComponent } from 'react'
import { MenuIcons } from '@/constants/icons'

export interface IconOption {
    value: string
    label: string
    icon: ForwardRefExoticComponent<any>
}

const getIconOptionsMemo = memoize(getIconOptions)

const useIconOptions = () => {
    const [iconOptions, setIconOptions] = useImmer(getIconOptionsMemo())

    return [iconOptions, setIconOptions] as const
}

export default useIconOptions

function getIconOptions() {
    const iconOptions: IconOption[] = []
    Object.keys(MenuIcons).forEach((key) => {
        const icon = MenuIcons[key as keyof typeof MenuIcons]
        iconOptions.push({
            value: key,
            label: key,
            icon: icon,
        })
    })

    return iconOptions
}
