import type { PostMessageData, ReceiveTrackingDataParams } from '@ifreeovo/track-link-sdk'
import { EventMethods, EventType } from '@ifreeovo/track-link-sdk'
import { useMemoizedFn, useToggle, useUnmount } from 'ahooks'
import emitter, { EmitterEventTypes } from '@/shared/emitter'
import { getDataUrl } from '@/shared/get-data-url'

interface UseInspectorProps {
    sendToIframe: (data: PostMessageData) => void
    toggleShowCreateModal: () => void
    setShowFullScreenLoading: (value: boolean) => void
}

const useInspector = (props: UseInspectorProps) => {
    const { sendToIframe, toggleShowCreateModal, setShowFullScreenLoading } = props
    const [isSelectInspector, { toggle: toggleSelectInspector, setLeft: stopSelectInspector }] =
        useToggle(false)
    const [xpath, setXpath] = useImmer('')
    const [snapshot, setSnapshot] = useImmer('')
    const [validationMarker, setValidationMarker] = useImmer('')

    const disableInspect = () => {
        emitter.off(EmitterEventTypes.ReceiveTrackingData, onReceiveTrackingData)
        emitter.off(EmitterEventTypes.BeforeReceiveData, onBeforeReceiveData)
        sendToIframe({
            type: EventType.SDK,
            method: EventMethods.DisableInspect,
        })
        stopSelectInspector()
    }

    const onClickInspector = useMemoizedFn(() => {
        toggleSelectInspector()

        const value = !isSelectInspector
        const eventName = value ? EventMethods.EnableInspect : EventMethods.DisableInspect
        if (eventName === EventMethods.EnableInspect) {
            emitter.on(EmitterEventTypes.ReceiveTrackingData, onReceiveTrackingData)
            emitter.on(EmitterEventTypes.BeforeReceiveData, onBeforeReceiveData)
            sendToIframe({
                type: EventType.SDK,
                method: eventName,
            })
        } else {
            disableInspect()
        }
    })

    // 在接收埋点数据前，开启loading
    const onBeforeReceiveData = useMemoizedFn(() => {
        setShowFullScreenLoading(true)
    })

    // 接受埋点数据
    const onReceiveTrackingData = useMemoizedFn(async (payload: ReceiveTrackingDataParams) => {
        stopSelectInspector()
        disableInspect()

        const tempSnapshot = await getDataUrl(payload.snapshotBlob)
        setSnapshot(tempSnapshot)
        setXpath(payload.xpath)
        setValidationMarker(payload.validationMarker)

        setShowFullScreenLoading(false)
        toggleShowCreateModal()
    })

    useUnmount(() => {
        disableInspect()
    })

    return {
        isSelectInspector,
        xpath,
        snapshot,
        validationMarker,
        disableInspect,
        onClickInspector,
        onBeforeReceiveData,
        onReceiveTrackingData,
    }
}

export default useInspector
