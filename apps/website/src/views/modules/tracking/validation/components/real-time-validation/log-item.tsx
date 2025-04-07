import { AuditOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { EventTypeEnum, ValidationResultEnum } from '@/constants/enums'
import { ValidationInfo } from '../log-modal'

export interface Log {
    eventName: string
    eventTime: string
    eventId: number
    eventType: EventTypeEnum
    validationResult: ValidationResultEnum
    datasource: ValidationInfo[]
    data: Record<string, string>
}

export interface LogItemProps {
    data: Log
    index: number
    onClickLogDetail?: (index: number) => void
}

const ValidateStatus = memo(({ status }: { status: ValidationResultEnum }) => {
    return status === ValidationResultEnum.Success ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
            验证通过
        </Tag>
    ) : (
        <Tag icon={<CloseCircleOutlined />} color="error">
            验证失败
        </Tag>
    )
})

const EventType = memo(({ type }: { type: EventTypeEnum }) => {
    return type === EventTypeEnum.Click ? (
        <Tag color="cyan">点击</Tag>
    ) : (
        <Tag color="gold">曝光</Tag>
    )
})

const LogItem: React.FC<LogItemProps> = (props) => {
    const { data, onClickLogDetail, index } = props

    const handleClickLogDetail = () => {
        onClickLogDetail && onClickLogDetail(index)
    }

    return (
        <div className="uno-h-full uno-px-[16px] uno-flex uno-items-center hover:uno-bg-[#e0e8ff]">
            <span className="uno-leading-16 uno-color-[#909090] uno-text-[12px] uno-mr-[8px]">
                {data.eventTime}
            </span>
            <EventType type={data.eventType}></EventType>

            <span
                title={data.eventName}
                className="uno-leading-16 uno-mr-[8px] uno-truncate uno-w-[146px]"
            >
                {data.eventName}
            </span>
            <ValidateStatus status={data.validationResult}></ValidateStatus>
            <AuditOutlined
                className="uno-cursor-pointer"
                title="详情"
                onClick={handleClickLogDetail}
            />
        </div>
    )
}

export default LogItem
