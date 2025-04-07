import { memoize } from 'lodash-es'
import { PublicRoutes } from '@/constants/path'
const getComponentsMemo = memoize(arrayToSelectOptions)

const useComponentsOptions = () => {
    const [componentsOptions, setComponentOptions] = useImmer(getComponentsMemo())

    return [componentsOptions, setComponentOptions] as const
}

export default useComponentsOptions

function getPageComponentNames() {
    const pages: string[] = []
    const modules = import.meta.glob('@/views/**/*.tsx')

    Object.keys(modules).forEach((path) => {
        const isComponentRoute = path.includes('components')
        const isHookRoute = path.includes('hooks')
        const isPublicRoute = PublicRoutes.some((route) => path.includes(route))
        if (isHookRoute || isComponentRoute || isPublicRoute) {
            return
        }

        const pathArr = path.split('/')
        const page = pathArr.slice(-2).shift()
        if (page) {
            pages.push(page)
        }
    })
    return pages
}

function arrayToSelectOptions() {
    const pageComponents = getPageComponentNames()

    const options = pageComponents.map((component) => {
        return { value: component, label: component }
    })

    return options
}
