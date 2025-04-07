import { useMemoizedFn, useToggle } from 'ahooks'
import emitter, { EmitterEventTypes } from '@/shared/emitter'

export interface useDrawerState {
    title?: string
}

const useDrawer = ({ title }: useDrawerState = {}) => {
    const [drawerTitle, setDrawerTitle] = useImmer(title ?? '')
    const [isOpenDrawer, { toggle: toggleDrawerState }] = useToggle()

    const onDrawerSubmitSuccess = useMemoizedFn(() => {
        emitter.emit(EmitterEventTypes.onDrawerSubmitSuccess)
    })

    return {
        isOpenDrawer,
        drawerTitle,
        setDrawerTitle,
        toggleDrawerState,
        onDrawerSubmitSuccess,
    }
}

export default useDrawer
