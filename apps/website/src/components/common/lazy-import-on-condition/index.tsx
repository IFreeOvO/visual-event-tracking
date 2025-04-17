import { ComponentType, LazyExoticComponent, Suspense, SuspenseProps } from 'react'

interface LazyImportProps<PropsType> {
    isLoad?: boolean
    lazy: LazyExoticComponent<ComponentType<any>>
    fallback?: SuspenseProps['fallback']
    componentProps?: PropsType
}

export const LazyImportOnCondition = <PropsType extends Record<string, any>>(
    props: LazyImportProps<PropsType>,
) => {
    const { isLoad, lazy, componentProps = {}, fallback } = props
    if (!isLoad) {
        return null
    }

    const LazyComponent = lazy
    return (
        <Suspense fallback={fallback}>
            <LazyComponent {...componentProps} />
        </Suspense>
    )
}
