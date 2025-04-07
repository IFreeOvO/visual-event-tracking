import type { TableColumnsType } from 'antd'
import { useMemoizedFn, usePagination } from 'ahooks'
import { Table, Image } from 'antd'
import { getTrackingList } from '@/api/service/tracking'
import { GLOBAL_PAGE_SIZE } from '@/constants/common'
import { EventTypeEnum } from '@/constants/enums'
import { Tracking } from '@/models/vo/tracking.vo'

interface GetDataParams {
    current: number
    pageSize: number
}

interface TrackingListProps {
    iframeURL: string
}

const TrackingList: React.FC<TrackingListProps> = ({ iframeURL }) => {
    const { id } = useParams()

    const getData = useMemoizedFn(async (options: GetDataParams) => {
        const params: Parameters<typeof getTrackingList>[0] = {
            page: options.current,
            limit: options.pageSize,
            filter: {
                projectId: Number(id),
                url: iframeURL,
            },
        }

        const [err, res] = await getTrackingList(params)
        if (err) {
            return {
                total: 0,
                list: [],
            }
        }
        const data = res.data
        return {
            total: data.total,
            list: data.data,
        }
    })

    const { data, loading, pagination } = usePagination(getData, {
        defaultPageSize: GLOBAL_PAGE_SIZE,
        refreshDeps: [iframeURL],
    })

    const columns: TableColumnsType<Tracking> = [
        {
            title: '事件名称',
            dataIndex: 'eventName',
            key: 'eventName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '事件类型',
            dataIndex: 'eventType',
            key: 'eventType',
            align: 'center',
            ellipsis: true,
            render: (value) => {
                const eventTypeMap = {
                    [EventTypeEnum.Click]: '点击',
                    [EventTypeEnum.Expose]: '曝光',
                }
                const types = value.map((v: EventTypeEnum) => eventTypeMap[v]).join(',')
                return types
            },
        },
        {
            title: '埋点快照',
            dataIndex: 'snapshot',
            key: 'snapshot',
            align: 'center',
            render: (_value, record) => <Image src={record.snapshot} width={50}></Image>,
        },
    ]

    return (
        <div>
            <div className="uno-text-[16px] uno-font-bold uno-mx-[16px] uno-mb-[16px]">
                当前路由埋点
            </div>
            <Table<Tracking>
                columns={columns}
                dataSource={data?.list}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: pagination.onChange,
                }}
            />
        </div>
    )
}

export default TrackingList
