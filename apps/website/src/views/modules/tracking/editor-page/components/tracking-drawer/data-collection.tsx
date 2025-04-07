import type { ReceiveTrackingDataParams } from '@ifreeovo/track-link-sdk'
import type { TableColumnsType } from 'antd'
import { PlusOutlined, SelectOutlined } from '@ant-design/icons'
import { EventMethods, EventType, PostMessageData } from '@ifreeovo/track-link-sdk'
import { useMemoizedFn, useToggle, useUnmount } from 'ahooks'
import { Button, Input, Table, Image } from 'antd'
import { Updater } from 'use-immer'
import { TrackingDatasource } from '@/models/vo/tracking.vo'
import emitter, { EmitterEventTypes } from '@/shared/emitter'
import { getDataUrl } from '@/shared/get-data-url'
import { getRandomString } from '@/shared/get-random-string'

export interface DataCollectionProps {
    value?: TrackingDatasource[]
    onChange?: (value?: TrackingDatasource[]) => void
    sendMessage: (data: PostMessageData) => void
    onDeleteRow?: (
        index: number,
        record: TrackingDatasource,
        setTableData: Updater<TrackingDatasource[]>,
    ) => void
    onClickRule?: (index: number) => void
    mode?: 'create' | 'edit'
}

export interface DataCollectionRef {
    tableData: TrackingDatasource[]
    setTableData: Updater<TrackingDatasource[]>
}

interface RequiredTitleProps {
    title: string
}

const DataCollection = forwardRef<DataCollectionRef, DataCollectionProps>((props, ref) => {
    const { value = [], mode, onChange, sendMessage, onDeleteRow, onClickRule } = props
    const [enableInspect, { toggle, setLeft: setDisableInspect }] = useToggle(false)
    const [currentIndex, setCurrentIndex] = useImmer(0)
    const [tableData, setTableData] = useImmer(value)
    const [page, setPage] = useImmer(1)
    const PAGE_SIZE = 5

    useImperativeHandle(ref, () => ({
        tableData,
        setTableData,
    }))

    useEffect(() => {
        onChange && onChange(tableData)
    }, [tableData, onChange])

    const onChangeFieldName = (v: string, index: number) => {
        const rowIndex = (page - 1) * PAGE_SIZE + index
        setTableData((draft) => {
            draft[rowIndex].fieldName = v
        })
    }

    const disableInspect = () => {
        setDisableInspect()
        emitter.off(EmitterEventTypes.ReceiveTrackingData, onReceiveTData)
        emitter.off(EmitterEventTypes.BeforeReceiveData, onBeforeReceiveData)

        sendMessage({
            type: EventType.SDK,
            method: EventMethods.DisableInspect,
        })
    }

    const onClickInspector = (index: number) => {
        if (!sendMessage) {
            return
        }
        const rowIndex = (page - 1) * PAGE_SIZE + index
        setCurrentIndex(rowIndex)
        toggle()

        const state = !enableInspect
        const eventName = state ? EventMethods.EnableInspect : EventMethods.DisableInspect
        if (eventName === EventMethods.EnableInspect) {
            emitter.on(EmitterEventTypes.ReceiveTrackingData, onReceiveTData)
            emitter.on(EmitterEventTypes.BeforeReceiveData, onBeforeReceiveData)
            sendMessage({
                type: EventType.SDK,
                method: eventName,
            })
        } else {
            disableInspect()
        }
    }

    const onBeforeReceiveData = () => {
        emitter.emit(EmitterEventTypes.showFullScreenLoading, true)
    }

    const onReceiveTData = useMemoizedFn(async (payload: ReceiveTrackingDataParams) => {
        setDisableInspect()
        const tempSnapshot = await getDataUrl(payload.snapshotBlob)
        setTableData((draft) => {
            draft[currentIndex].fieldSnapshot = tempSnapshot
            draft[currentIndex].fieldXpath = payload.xpath
        })

        emitter.emit(EmitterEventTypes.showFullScreenLoading, false)
        sendMessage &&
            sendMessage({
                type: EventType.SDK,
                method: EventMethods.DisableInspect,
            })
    })

    const handleRemoveRow = (index: number) => {
        const rowIndex = (page - 1) * PAGE_SIZE + index
        if (onDeleteRow) {
            onDeleteRow(rowIndex, tableData[rowIndex], setTableData)
            return
        }
        setTableData((draft) => {
            draft.splice(rowIndex, 1)
        })
    }

    const handleAddRule = (index: number) => {
        onClickRule && onClickRule(index)
    }

    const onPageChange = (page: number) => {
        setPage(page)
    }

    const RequiredTitle = memo<RequiredTitleProps>(({ title }) => (
        <span>
            <span className="uno-text-red">*</span>
            {title}
        </span>
    ))

    const columns: TableColumnsType<TrackingDatasource> = [
        {
            title: <RequiredTitle title="字段名称" />,
            dataIndex: 'fieldName',
            key: 'fieldName',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (_value, record, index) => (
                <Input
                    value={record.fieldName}
                    placeholder="请输入"
                    onChange={(e) => {
                        onChangeFieldName(e.target.value, index)
                    }}
                ></Input>
            ),
        },
        {
            title: <RequiredTitle title="来源xpath" />,
            dataIndex: 'fieldXpath',
            key: 'fieldXpath',
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: <RequiredTitle title="快照" />,
            dataIndex: 'fieldSnapshot',
            key: 'fieldSnapshot',
            align: 'center',
            render: (_value, record) => <Image src={record.fieldSnapshot} width={50}></Image>,
        },
        {
            title: '选取元素',
            key: 'action',
            align: 'center',
            render: (_value, _record, index) => (
                <Button
                    icon={<SelectOutlined />}
                    color="primary"
                    variant="text"
                    onClick={() => {
                        onClickInspector(index)
                    }}
                ></Button>
            ),
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            render: (_value, _record, index) => {
                return (
                    <>
                        <Button
                            className="uno-px-0"
                            color="primary"
                            variant="text"
                            onClick={() => {
                                handleAddRule(index)
                            }}
                        >
                            {mode === 'create' ? '添加规则' : '编辑规则'}
                        </Button>
                        <Button
                            className="uno-px-0"
                            color="danger"
                            variant="text"
                            onClick={() => {
                                handleRemoveRow(index)
                            }}
                        >
                            删除
                        </Button>
                    </>
                )
            },
        },
    ]

    const addData = () => {
        setTableData((draft) => {
            draft.push({
                tempId: getRandomString(),
                fieldName: '',
                fieldXpath: '',
                fieldSnapshot: '',
            })
        })
    }

    useUnmount(() => {
        disableInspect()
    })

    return (
        <div>
            <Table<TrackingDatasource>
                columns={columns}
                dataSource={tableData}
                rowKey="tempId"
                pagination={{
                    current: page,
                    pageSize: PAGE_SIZE,
                    onChange: onPageChange,
                }}
            />
            <Button
                icon={<PlusOutlined />}
                block
                color="primary"
                variant="dashed"
                className="uno-mt-[16px]"
                onClick={addData}
            >
                添加数据来源
            </Button>
        </div>
    )
})

export default DataCollection
