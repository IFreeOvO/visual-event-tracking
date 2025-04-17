import type { DrawerProps, GetProps, SwitchProps, TableColumnsType } from 'antd'
import { useMemoizedFn, usePagination } from 'ahooks'
import { Button, Drawer, Table, Image, Form, Input, Space, Popconfirm, message, Switch } from 'antd'
import { deleteTracking, getTrackingList } from '@/api/service/tracking'
import { GLOBAL_PAGE_SIZE } from '@/constants/common'
import { EventTypeEnum } from '@/constants/enums'
import useEmitterListener from '@/hooks/common/use-emitter-listener'
import { Tracking } from '@/models/vo/tracking.vo'
import { EmitterEventTypes } from '@/shared/emitter'

export type EventManageDrawerProps = DrawerProps & {
    onEditRow?: (data: Tracking) => void
    iframeURL: string
}

type SearchProps = GetProps<typeof Input.Search>

interface GetDataParams {
    current: number
    pageSize: number
}

const { Search } = Input

const EventManageDrawer: React.FC<EventManageDrawerProps> = memo((props) => {
    const { open, iframeURL, onEditRow } = props
    const { id } = useParams()
    const [eventName, setEventName] = useImmer('')
    const [onlyShowCurrentRoute, setOnlyShowCurrentRoute] = useState(true)

    const getData = useMemoizedFn(async (options: GetDataParams) => {
        const params: Parameters<typeof getTrackingList>[0] = {
            page: options.current,
            limit: options.pageSize,
            filter: {
                eventName,
                projectId: Number(id),
            },
        }
        if (onlyShowCurrentRoute && params.filter) {
            params.filter.url = iframeURL
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

    const { data, loading, pagination, refresh } = usePagination(getData, {
        defaultPageSize: GLOBAL_PAGE_SIZE,
        refreshDeps: [eventName, onlyShowCurrentRoute],
    })

    const handleRemoveRow = async (id: number) => {
        const [err] = await deleteTracking(id)
        if (err) {
            return
        }
        message.success('删除成功')
        refresh()
    }

    const handleEditRow = async (id: number) => {
        const trackingData = data?.list.find((item) => item.id === id)
        if (trackingData) {
            onEditRow && onEditRow(trackingData)
        }
    }

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
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_value, record) => {
                return (
                    <Space>
                        <Button
                            className="uno-px-0"
                            color="primary"
                            variant="text"
                            onClick={() => {
                                handleEditRow(record.id)
                            }}
                        >
                            编辑
                        </Button>
                        <Popconfirm
                            title="确认删除?"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={() => {
                                handleRemoveRow(record.id)
                            }}
                        >
                            <Button className="uno-px-0" color="danger" variant="text">
                                删除
                            </Button>
                        </Popconfirm>
                    </Space>
                )
            },
        },
    ]

    const onSearch: SearchProps['onSearch'] = async (value) => {
        setEventName(value)
    }

    const onChange: SwitchProps['onChange'] = (value) => {
        setOnlyShowCurrentRoute(value)
    }

    useEffect(() => {
        if (open) {
            refresh()
        }
    }, [open, iframeURL, refresh])

    useEmitterListener(EmitterEventTypes.onEditTrackingSuccess, () => {
        refresh()
    })

    return (
        <Drawer {...props} mask={false} width="500px" zIndex={90} title="事件管理">
            <div>
                <Space>
                    <span>仅展示当前路由埋点</span>
                    <Switch value={onlyShowCurrentRoute} onChange={onChange} />
                </Space>
            </div>
            <Form name="event-manage-form" autoComplete="off" className="uno-mt-[16px]">
                <Form.Item name="eventName">
                    <Search placeholder="请输入事件名称" onSearch={onSearch} value={eventName} />
                </Form.Item>
            </Form>

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
        </Drawer>
    )
})

export default EventManageDrawer
