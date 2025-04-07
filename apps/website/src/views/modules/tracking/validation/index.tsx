import { useMemoizedFn } from 'ahooks'
import { Divider, Flex, Tabs, TabsProps } from 'antd'
import AddressBar from '@/components/business/address-bar'
import Navigation from '@/components/business/navigation'
import useRouter from '@/hooks/common/use-router'
import usePostMessage from '../../../../hooks/business/use-post-message'
import useIframeRouter from '../editor-page/hooks/use-iframe-router'
import RealTimeValidation from './components/real-time-validation'
import TrackingList from './components/track-list'
import './index.scss'

const ValidationPage: React.FC = () => {
    const { go } = useRouter()
    const [searchParams] = useSearchParams()
    const projectURL = searchParams.get('url') ?? ''
    const projectName = searchParams.get('name') ?? ''
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const onNavigationBack = useMemoizedFn(() => {
        // 子iframe的路由会影响父iframe的history堆栈长度。所以回退时，按照iframe的history堆栈长度回退
        const iframeHistoryStackLength = historyStack.length
        if (iframeHistoryStackLength === 0) {
            go(-1)
            return
        }
        go(-iframeHistoryStackLength)
    })

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

    const TabItems: TabsProps['items'] = [
        {
            label: '实时验证',
            key: 'real-time-validation',
            children: <RealTimeValidation iframeURL={navigationURL} />,
        },
        {
            label: '埋点列表',
            key: 'tracking-list',
            children: <TrackingList iframeURL={navigationURL} />,
        },
    ]

    return (
        <>
            <Navigation title={projectName} onBack={onNavigationBack}></Navigation>
            <div
                className="uno-h-[calc(100%-60px)] uno-overflow-hidden uno-flex "
                id="validation-content"
            >
                <div className="uno-flex-1 uno-flex">
                    {/* 调试界面 */}
                    <div className="uno-flex-1 uno-flex uno-flex-col">
                        <Flex
                            justify="space-between"
                            align="center"
                            className="uno-h-[50px]  uno-bg-[#e0e8ff]  uno-px-[16px]"
                        >
                            <AddressBar
                                url={navigationURL}
                                disableBack={disableBack}
                                disableForward={disableForward}
                                onBack={onClickBack}
                                onForward={onClickForward}
                                onSearch={onClickRefresh}
                            ></AddressBar>
                        </Flex>
                        <iframe
                            className="uno-flex-1 uno-border-0"
                            src={projectURL}
                            ref={iframeRef}
                        ></iframe>
                    </div>
                    <Divider type="vertical" className="uno-h-full !uno-m-[0]" />
                    {/* 事件日志  */}
                    <div className="uno-flex-grow-0 uno-flex-shrink-0 uno-basis-[400px]">
                        <Tabs type="card" items={TabItems} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ValidationPage
