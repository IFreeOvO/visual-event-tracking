import type { Events } from '@/shared/emitter'
import type { Handler } from 'mitt'
import { useMemoizedFn } from 'ahooks'
import emitter from '@/shared/emitter'

const useEmitterListener = <Key extends keyof Events>(
    eventType: Key,
    listener: Handler<Events[Key]>,
) => {
    const { on, off } = emitter

    const memoizedCallback = useMemoizedFn(listener)

    const removeListener = useMemoizedFn(() => {
        off(eventType, memoizedCallback)
    })

    useEffect(() => {
        on(eventType, memoizedCallback)

        return () => {
            removeListener()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 返回一个函数，允许用户主动移除监听
    return () => {
        removeListener()
    }
}

export default useEmitterListener
