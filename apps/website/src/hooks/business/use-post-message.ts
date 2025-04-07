import type { PostMessageData } from '@ifreeovo/track-link-sdk'
import { useMemoizedFn } from 'ahooks'
import emitter from '@/shared/emitter'

interface Options {
    iframeRef: React.RefObject<HTMLIFrameElement>
    iframeUrl: string
}

function usePostMessage(options: Options) {
    const { iframeUrl = '*', iframeRef } = options
    const normalizeIframeURL = normalizeURL(iframeUrl)

    const handleMsg = useMemoizedFn((event: MessageEvent) => {
        if (event.origin === normalizeIframeURL) {
            const payload = event.data as PostMessageData
            emitter.emit(payload.method as any, payload.params)
        }
    })

    const sendToIframe = useMemoizedFn((message: PostMessageData) => {
        const contentWindow = iframeRef.current?.contentWindow
        if (contentWindow) {
            contentWindow.postMessage(message, normalizeIframeURL)
        }
    })

    useEffect(() => {
        window.addEventListener('message', handleMsg)
        return () => {
            window.removeEventListener('message', handleMsg)
        }
    }, [handleMsg])

    return { sendToIframe }
}

export default usePostMessage

function normalizeURL(url: string) {
    return new URL(url).origin
}
