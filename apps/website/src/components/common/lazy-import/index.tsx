import { ComponentType, FC, LazyExoticComponent, Suspense, SuspenseProps } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import Loading from '@/components/common/loading'
import PageError from '@/views/page-error'

interface LazyImportProps {
    lazy?: LazyExoticComponent<ComponentType>
    fallback?: SuspenseProps['fallback']
}

export const LazyImport: FC<LazyImportProps> = ({ lazy, fallback = <Loading /> }) => {
    const LazyComponent = lazy ?? (() => null)
    return (
        <ErrorBoundary FallbackComponent={PageError}>
            <Suspense fallback={fallback}>
                <LazyComponent />
            </Suspense>
        </ErrorBoundary>
    )
}
