import type { Log, LogItemProps } from './log-item'
import type { ValidationInfo } from '../log-modal'
import { CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemoizedFn, useToggle } from 'ahooks'
import { theme } from 'antd'
import dayjs from 'dayjs'
import { getTrackingList } from '@/api/service/tracking'
import { EventTypeEnum, RuleRequiredEnum, ValidationResultEnum } from '@/constants/enums'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import { Tracking } from '@/models/vo/tracking.vo'
import { EmitterEventTypes } from '@/shared/emitter'
import LogModal from '../log-modal'
import LogItem from './log-item'

interface ValidationMsg {
    eventId: number
    eventName: string
    eventType: EventTypeEnum
    xpath: string
    data: Record<string, any>
    validationResult: ValidationResultEnum
}

interface RealTimeValidationProps {
    iframeURL: string
}

enum ValidationStatusEnum {
    Fail = 'fail',
    Success = 'success',
    Pending = 'pending',
}

type TrackList = Omit<Tracking, 'datasource'> & {
    validationStatus: ValidationStatusEnum
} & {
    datasource: Array<
        Tracking['datasource'][number] & {
            fieldValue?: string
        }
    >
}

const RealTimeValidation: React.FC<RealTimeValidationProps> = (props) => {
    const { iframeURL } = props
    const { token } = theme.useToken()
    const { id } = useParams()
    const [logList, setLogList] = useImmer<Log[]>([])
    const scrollContainerRef = useRef(null)
    const rowVirtualizer = useVirtualizer({
        count: logList.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => 35,
    })
    const [lastAbortController, setLastAbortController] = useImmer<AbortController | undefined>(
        undefined,
    )
    const [trackingList, setTrackingList] = useImmer<TrackList[]>([])
    const [logModal, { toggle: toggleLogModal }] = useToggle(false)
    const [currentValidationList, setCurrentValidationList] = useImmer<ValidationInfo[]>([])
    const failCount = trackingList.filter(
        (item) => item.validationStatus === ValidationStatusEnum.Fail,
    ).length
    const successCount = trackingList.filter(
        (item) => item.validationStatus === ValidationStatusEnum.Success,
    ).length
    const pendingCount = trackingList.filter(
        (item) => item.validationStatus === ValidationStatusEnum.Pending,
    ).length

    const getValidationLog = useMemoizedFn((msg: ValidationMsg) => {
        setLogList((draft) => {
            const newData: Log = {
                ...msg,
                eventTime: dayjs().format('HH:mm:ss'),
                datasource: [],
            }
            draft.unshift(newData)
        })

        const tracking = trackingList.find(
            (item) => item.id === msg.eventId && item.eventType.includes(msg.eventType),
        )
        if (tracking) {
            // 记录成功和失败的事件
            if (msg.validationResult === ValidationResultEnum.Success) {
                tracking.validationStatus = ValidationStatusEnum.Success
            } else {
                tracking.validationStatus = ValidationStatusEnum.Fail
            }
        }
    })

    const getData = useMemoizedFn(async () => {
        if (lastAbortController) {
            lastAbortController.abort()
            setLastAbortController(undefined)
        }
        const controller = new AbortController()
        setLastAbortController(controller)

        const params: Parameters<typeof getTrackingList>[0] = {
            page: 1,
            filter: {
                projectId: Number(id),
                url: iframeURL,
            },
        }

        const [err, res] = await getTrackingList(params)
        if (err) {
            return
        }
        const data = res.data.data
        const eventList: Tracking[] = []
        data.forEach((item) => {
            if (item.eventType.length === 2) {
                eventList.push({
                    ...item,
                    eventType: [EventTypeEnum.Click],
                })
                eventList.push({
                    ...item,
                    eventType: [EventTypeEnum.Expose],
                })
            } else {
                eventList.push(item)
            }
        })
        const list = eventList.map((item) => ({
            ...item,
            validationStatus: ValidationStatusEnum.Pending,
        }))
        setTrackingList(list)
    })

    const onClickLogDetail: LogItemProps['onClickLogDetail'] = (index) => {
        const trackingInfo = logList[index]
        const eventConfig = trackingList.find((item) => item.id === trackingInfo.eventId)
        const list =
            eventConfig?.datasource.map((item) => {
                const newItem: ValidationInfo = {
                    fieldName: item.fieldName,
                    isRequired: item.isRequired,
                    reg: item.reg,
                    fieldValue: trackingInfo.data[item.fieldName],
                }
                newItem.validationResult = getValidationResult(newItem)
                return newItem
            }) ?? []

        setCurrentValidationList(list)
        toggleLogModal()
    }

    // 切换路由时，清空日志
    useEffect(() => {
        setLogList([])

        getData()
    }, [iframeURL, setLogList, getData])

    useEmitterListener(EmitterEventTypes.ReportValidation, getValidationLog)

    return (
        <>
            <div id="real-time-validation" className="uno-h-full">
                <div className="uno-text-[16px] uno-items-center uno-font-bold uno-mx-[16px]">
                    实时日志
                </div>
                <div className="uno-flex uno-gap-[16px] uno-mb-[8px] uno-mx-[16px]">
                    <div className="uno-flex uno-leading-[24px] uno-gap-[4px]">
                        <CheckCircleOutlined style={{ color: token.colorSuccess }} />
                        <span className="uno-text-[12px]">成功 {successCount}</span>
                    </div>
                    <div className="uno-flex uno-leading-[24px] uno-gap-[4px]">
                        <CloseCircleOutlined style={{ color: token.colorError }} />
                        <span className="uno-text-[12px]">失败 {failCount}</span>
                    </div>
                    <div className="uno-flex uno-leading-[24px] uno-gap-[4px]">
                        <MinusCircleOutlined style={{ color: token.colorTextTertiary }} />
                        <span className="uno-text-[12px]">待验证 {pendingCount}</span>
                    </div>
                </div>
                <div className="uno-leading-[16px] uno-h-[16px] uno-mx-[16px] uno-mb-[8px] uno-text-[12px]">
                    tip: 仅统计当前路由埋点，曝光和点击各算一次事件
                </div>
                <div
                    className="uno-h-[calc(100%-81px)] uno-overflow-y-auto uno-border-t uno-border-t-solid uno-border-t-[#eee]"
                    ref={scrollContainerRef}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                }}
                            >
                                <LogItem
                                    index={virtualItem.index}
                                    data={logList[virtualItem.index]}
                                    onClickLogDetail={onClickLogDetail}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <LogModal
                open={logModal}
                onCancel={toggleLogModal}
                onOk={toggleLogModal}
                data={currentValidationList}
            ></LogModal>
        </>
    )
}

export default RealTimeValidation

function getValidationResult(trackingInfo: Log['datasource'][number]) {
    let result = ValidationResultEnum.Failed
    if (trackingInfo.isRequired === RuleRequiredEnum.YES && !trackingInfo.fieldValue) {
        return result
    }
    if (trackingInfo.reg) {
        const reg = new RegExp(trackingInfo.reg)
        if (reg.test(trackingInfo.fieldValue ?? '')) {
            result = ValidationResultEnum.Success
        }
    } else {
        // 不传正则时，默认不验证字段，所以直接返回成功
        result = ValidationResultEnum.Success
    }
    return result
}
