import type { EventManageDrawerProps } from './components/event-manage-drawer'
import type { CreateTrackingDrawerProps } from './components/tracking-drawer/create-tracking-drawer'
import type { EditTrackingDrawerProps } from './components/tracking-drawer/edit-tracking-drawer'
import { createChannelId } from '@ifreeovo/track-link-sdk'
import { useMemoizedFn, useToggle } from 'ahooks'
import { Space, Button, Divider, Flex, theme } from 'antd'
import Navigation from '@/components/business/navigation'
import { LazyImportOnCondition } from '@/components/common/lazy-import-on-condition'
import Loading from '@/components/common/loading'
import { DEVTOOL_URL, DEVTOOL_WEBSOCKET_URL } from '@/constants/domains'
import usePostMessage from '@/hooks/business/use-post-message'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import useRouter from '@/hooks/common/use-router'
import { Tracking } from '@/models/vo/tracking.vo'
import { EmitterEventTypes } from '@/shared/emitter'
import EditorHeader from './components/editor-header'
// import EventManageDrawer from './components/event-manage-drawer'
// import SDKModal from './components/sdk-modal'
// import CreateTrackingDrawer from './components/tracking-drawer/create-tracking-drawer'
// import EditTrackingDrawer from './components/tracking-drawer/edit-tracking-drawer'
import { SDKModalProps } from './components/sdk-modal'
import useIframeRouter from './hooks/use-iframe-router'
import useInspector from './hooks/use-inspector'
const CreateTrackingDrawer = lazy(
    () => import('./components/tracking-drawer/create-tracking-drawer'),
)
const EditTrackingDrawer = lazy(() => import('./components/tracking-drawer/edit-tracking-drawer'))
const EventManageDrawer = lazy(() => import('./components/event-manage-drawer'))
const SDKModal = lazy(() => import('./components/sdk-modal'))

const EditorPage: React.FC = () => {
    const {
        token: { colorPrimaryBg, boxShadowTertiary },
    } = theme.useToken()
    const { go } = useRouter()
    const channelId = useRef(createChannelId())
    const devtoolUrl = useMemo(() => {
        const websocketURL = encodeURIComponent(
            `${DEVTOOL_WEBSOCKET_URL}?channelId=${channelId.current}&from=1`,
        )
        return `${DEVTOOL_URL}?ws=${websocketURL}`
    }, [channelId])
    const [searchParams] = useSearchParams()
    const projectURL = searchParams.get('url') ?? ''
    const projectName = searchParams.get('name') ?? ''
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const [showIframe, setShowIframe] = useImmer(false)
    const [isLoaded, setIsLoaded] = useImmer(true)
    const [showFullScreenLoading, setShowFullScreenLoading] = useImmer(false)
    const [showCreateModal, { toggle: toggleShowCreateModal }] = useToggle(false)
    const [showEventManageDrawer, { toggle: toggleShowEventManageDrawer }] = useToggle(false)
    const [showEditTrackingDrawer, { toggle: toggleShowEditTrackingDrawer }] = useToggle(false)
    const [trackingId, setTrackingId] = useImmer<number>(-1)
    const [showSDKModal, { toggle: toggleShowSDKModal }] = useToggle(false)

    const { sendToIframe } = usePostMessage({
        iframeUrl: projectURL,
        iframeRef,
    })

    const {
        navigationURL,
        disableBack,
        disableForward,
        historyStack,
        onClickBack,
        onClickForward,
        onClickRefresh,
    } = useIframeRouter({
        projectURL,
        sendToIframe,
    })

    const {
        isSelectInspector,
        disableInspect,
        onClickInspector,
        xpath,
        snapshot,
        validationMarker,
    } = useInspector({
        sendToIframe,
        toggleShowCreateModal,
        setShowFullScreenLoading,
    })

    const onNavigationBack = useMemoizedFn(() => {
        // 子iframe的路由会影响父iframe的history堆栈长度。所以回退时，按照iframe的history堆栈长度回退
        const iframeHistoryStackLength = historyStack.length
        if (iframeHistoryStackLength === 0) {
            go(-1)
            return
        }
        go(-iframeHistoryStackLength)
    })

    const onDevtoolLoad = () => {
        setIsLoaded(false)
    }

    // 这里是为了让项目先加载，再去加载devtool
    const onProjectLoad = () => {
        setShowIframe(true)
    }

    const onEditTrackingRow = useMemoizedFn((data: Tracking) => {
        setTrackingId(data.id)
        toggleShowEditTrackingDrawer()
    })

    const onClickEventManage = () => {
        disableInspect()
        toggleShowEventManageDrawer()
    }

    // 把channelId设置到iframe的name属性中，方便sdk获取
    useEffect(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.name = channelId.current
        }
    }, [iframeRef])

    useEmitterListener(EmitterEventTypes.showFullScreenLoading, setShowFullScreenLoading)

    return (
        <>
            <Navigation title={projectName} onBack={onNavigationBack}>
                <Flex className="uno-mr-[16px]" align="center">
                    <Space>
                        <Button onClick={toggleShowSDKModal}>生成SDK</Button>
                        <Button type="primary" onClick={onClickEventManage}>
                            事件管理
                        </Button>
                    </Space>
                </Flex>
            </Navigation>
            <div
                className="uno-h-[calc(100%-60px)] uno-overflow-hidden uno-px-[16px]"
                style={{
                    background: colorPrimaryBg,
                }}
            >
                <EditorHeader
                    url={navigationURL}
                    disableBack={disableBack}
                    disableForward={disableForward}
                    isSelectInspector={isSelectInspector}
                    onSearch={onClickRefresh}
                    onBack={onClickBack}
                    onForward={onClickForward}
                    onClickInspector={onClickInspector}
                ></EditorHeader>
                <Flex
                    className="uno-h-[calc(100%-92px)] uno-bg-white uno-relative uno-rounded-[6px] uno-overflow-hidden"
                    style={{
                        boxShadow: boxShadowTertiary,
                    }}
                >
                    <div className="uno-flex-1 uno-flex">
                        {/* 调试界面 */}
                        <div className="uno-flex-1 uno-flex uno-items-center uno-justify-center">
                            <iframe
                                className="uno-block uno-h-full uno-w-full uno-border-0"
                                src={projectURL}
                                ref={iframeRef}
                                onLoad={onProjectLoad}
                            ></iframe>
                        </div>
                        <Divider type="vertical" className="uno-h-full !uno-m-[0]" />
                        {/* devtool工具  */}
                        <div className="uno-flex-grow-0 uno-flex-shrink-0 uno-basis-[530px]">
                            {showIframe ? (
                                <iframe
                                    className="uno-block uno-h-full uno-w-full uno-border-0"
                                    src={devtoolUrl}
                                    onLoad={onDevtoolLoad}
                                ></iframe>
                            ) : null}
                        </div>
                    </div>
                    {isLoaded ? <Loading className="uno-w-full uno-bg-white"></Loading> : null}
                </Flex>
            </div>
            {/* 创建埋点 */}
            <LazyImportOnCondition<CreateTrackingDrawerProps>
                lazy={CreateTrackingDrawer}
                isLoad={showCreateModal}
                componentProps={{
                    xpath,
                    snapshot,
                    validationMarker,
                    url: navigationURL,
                    open: showCreateModal,
                    sendMessage: sendToIframe,
                    onCancel: toggleShowCreateModal,
                    onSubmitSuccess: toggleShowCreateModal,
                }}
            ></LazyImportOnCondition>
            {/* 编辑埋点 */}
            <LazyImportOnCondition<EditTrackingDrawerProps>
                lazy={EditTrackingDrawer}
                isLoad={showEditTrackingDrawer}
                componentProps={{
                    trackingId,
                    open: showEditTrackingDrawer,
                    sendMessage: sendToIframe,
                    onCancel: toggleShowEditTrackingDrawer,
                    onSubmitSuccess: toggleShowEditTrackingDrawer,
                }}
            ></LazyImportOnCondition>
            {/* 事件管理 */}
            <LazyImportOnCondition<EventManageDrawerProps>
                lazy={EventManageDrawer}
                isLoad={showEventManageDrawer}
                componentProps={{
                    iframeURL: navigationURL,
                    open: showEventManageDrawer,
                    onEditRow: onEditTrackingRow,
                    onClose: toggleShowEventManageDrawer,
                }}
            ></LazyImportOnCondition>
            {/* 生成SDK */}
            <LazyImportOnCondition<SDKModalProps>
                lazy={SDKModal}
                isLoad={showSDKModal}
                componentProps={{
                    open: showSDKModal,
                    onCancel: toggleShowSDKModal,
                    onOk: toggleShowSDKModal,
                }}
            ></LazyImportOnCondition>
            <Loading fullscreen spinning={showFullScreenLoading}></Loading>
        </>
    )
}

export default EditorPage
