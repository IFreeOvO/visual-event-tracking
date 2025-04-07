import type { PostMessageData } from '@ifreeovo/track-link-sdk'
import { EventMethods, EventType, SendIframeInfoParams } from '@ifreeovo/track-link-sdk'
import { useMemoizedFn } from 'ahooks'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import { EmitterEventTypes } from '@/shared/emitter'

interface UseIframeRouterProps {
    projectURL: string
    sendToIframe: (data: PostMessageData) => void
}

const useIframeRouter = (props: UseIframeRouterProps) => {
    const { projectURL, sendToIframe } = props
    const [isRefreshing, setIsRefreshing] = useImmer(false)
    const [iframeOrigin, setIframeOrigin] = useImmer<string>('')
    const [historyStack, setHistoryStack] = useImmer<string[]>([])
    const [currentPos, setCurrentPos] = useImmer(0)
    const [navigationURL, setNavigationURL] = useImmer(projectURL)
    const disableBack = currentPos === 0 ? true : false
    const disableForward = currentPos === historyStack.length - 1 ? true : false

    // 监听iframe的forward
    const onForward = useMemoizedFn(({ path }: { path: string }) => {
        setHistoryStack((draft) => {
            const fullPath = getFullPath(iframeOrigin, path)
            // 删除插入位置后面的所有元素后，再添加新地址
            draft.splice(currentPos + 1)
            draft.push(fullPath)
        })
        setCurrentPos((draft) => draft + 1)
    })

    // 监听iframe的替换
    const onReplace = useMemoizedFn(({ path }: { path?: string }) => {
        if (path) {
            setHistoryStack((draft) => {
                const fullPath = getFullPath(iframeOrigin, path)
                draft.splice(currentPos, 1, fullPath)
            })
        }
    })

    // 监听iframe的前进和后退
    const onPopstate = useMemoizedFn(({ delta }: { delta: number }) => {
        setCurrentPos((draft) => draft + delta)
    })

    // 获取iframe的初始化参数
    const getIframeInfoParams = useMemoizedFn((data: SendIframeInfoParams) => {
        if (isRefreshing) {
            setIsRefreshing(false)
            return
        }
        setHistoryStack((draft) => {
            draft.length = 0
            draft.push(data.fullPath)
        })
        setIframeOrigin(data.origin)
    })

    // 同步iframe的当前的url
    const onSyncURL = useMemoizedFn(({ fullPath }: { fullPath: string }) => {
        setNavigationURL(fullPath)
    })

    // 点击后退按钮
    const onClickBack = useMemoizedFn(() => {
        setCurrentPos((draft) => draft - 1)
        sendToIframe({
            type: EventType.History,
            method: EventMethods.RequestBack,
        })
    })

    // 点击前进按钮
    const onClickForward = useMemoizedFn(() => {
        setCurrentPos((draft) => draft + 1)
        sendToIframe({
            type: EventType.History,
            method: EventMethods.RequestForward,
        })
    })

    // 点击刷新按钮
    const onClickRefresh = useMemoizedFn(() => {
        setIsRefreshing(true)
        sendToIframe({
            type: EventType.History,
            method: EventMethods.RequestRefresh,
        })
    })

    useEmitterListener(EmitterEventTypes.Forward, onForward)
    useEmitterListener(EmitterEventTypes.Replace, onReplace)
    useEmitterListener(EmitterEventTypes.Popstate, onPopstate)
    useEmitterListener(EmitterEventTypes.SyncURL, onSyncURL)
    useEmitterListener(EmitterEventTypes.SendIframeInfoParams, getIframeInfoParams)

    return {
        navigationURL,
        disableBack,
        disableForward,
        historyStack,
        currentPos,
        iframeOrigin,
        setIframeOrigin,
        setCurrentPos,
        setHistoryStack,
        onClickBack,
        onClickForward,
        onClickRefresh,
    }
}

export default useIframeRouter

function getFullPath(origin: string, path: string) {
    const separator = path.startsWith('#') ? '/' : ''
    const fullPath = origin + separator + path
    return fullPath
}
