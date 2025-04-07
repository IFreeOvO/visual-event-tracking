import type { DataCollectionProps, DataCollectionRef } from './data-collection'
import type { RuleModalProps } from '../rule-modal'
import type { FormDrawerProps } from '@/components/business/form-drawer'
import type { FormInstance } from 'antd'
import { PostMessageData } from '@ifreeovo/track-link-sdk'
import { useToggle } from 'ahooks'
import { Form, Image, Input, Checkbox, Radio } from 'antd'
import FormDrawer from '@/components/business/form-drawer'
import { EventTypeEnum, SiblingEffectiveEnum } from '@/constants/enums'
import { Tracking, TrackingDatasource } from '@/models/vo/tracking.vo'
import RuleModal from '../rule-modal'
import DataCollection from './data-collection'
interface ImageItemProps {
    value?: string
    onChange?: (value?: string) => void
}

export type TrackingDrawerProps = FormDrawerProps & {
    mode?: 'create' | 'edit'
    name?: string
    form: FormInstance
    formData?: Partial<Tracking>
    onFinishForm?: (data: Tracking) => void
    sendMessage: (data: PostMessageData) => void
    onDeleteRow?: DataCollectionProps['onDeleteRow']
}

const ImageItem = memo<ImageItemProps>((props) => {
    const { value } = props
    return <Image width={200} src={value} />
})

const TrackingDrawer: React.FC<TrackingDrawerProps> = (props) => {
    const {
        form,
        formData = {},
        onCancel,
        onFinishForm,
        sendMessage,
        onDeleteRow,
        mode = 'create',
    } = props

    const [showRuleModal, { toggle: toggleShowRuleModal }] = useToggle(false)
    const [ruleRowIndex, setRuleRowIndex] = useImmer(0)
    const [currentRow, setCurrentRow] = useImmer<Partial<TrackingDatasource>>({})
    const tableRef = useRef<DataCollectionRef>(null)
    const eventTypeOptions = [
        { label: '点击', value: EventTypeEnum.Click },
        { label: '曝光', value: EventTypeEnum.Expose },
    ]
    const radioOptions = [
        { label: '否', value: SiblingEffectiveEnum.No },
        { label: '是', value: SiblingEffectiveEnum.Yes },
    ]

    const handleSubmit = () => {
        form.submit()
    }

    const handleCancel: FormDrawerProps['onCancel'] = (e) => {
        form.resetFields()
        onCancel && onCancel(e)
    }

    const onClickRule: DataCollectionProps['onClickRule'] = (index) => {
        const tableData = tableRef.current?.tableData ?? []
        setRuleRowIndex(index)
        setCurrentRow(tableData[index])
        toggleShowRuleModal()
    }

    const onRuleSubmit: RuleModalProps['onRuleSubmit'] = (values, ruleForm) => {
        tableRef.current?.setTableData((draft) => {
            draft[ruleRowIndex].isRequired = values.isRequired
            draft[ruleRowIndex].reg = values.reg
        })
        toggleShowRuleModal()
        ruleForm.resetFields()
    }

    useEffect(() => {
        form.setFieldsValue(formData)
        const dataLength = formData.datasource?.length ?? 0
        if (dataLength > 0) {
            tableRef.current?.setTableData(formData.datasource ?? [])
        }
    }, [formData, form])

    return (
        <>
            <FormDrawer
                {...props}
                mask={false}
                onClose={handleCancel}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                width="540px"
                zIndex={100}
            >
                <Form
                    layout="vertical"
                    autoComplete="off"
                    name={props.name}
                    labelCol={{ span: 10 }}
                    form={form}
                    onFinish={onFinishForm}
                    initialValues={{
                        eventName: formData.eventName,
                        url: formData.url,
                        xpath: formData.xpath,
                        eventType: formData.eventType ?? [EventTypeEnum.Click],
                        isSiblingEffective: formData.isSiblingEffective ?? SiblingEffectiveEnum.No,
                        snapshot: formData.snapshot,
                        datasource: formData.datasource,
                    }}
                >
                    <Form.Item<Tracking> label="事件名称" name="eventName" required>
                        <Input placeholder="请输入事件名称" allowClear />
                    </Form.Item>
                    <Form.Item<Tracking> label="页面地址" name="url" required>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item<Tracking> label="埋点元素xpath" name="xpath" required>
                        <Input disabled={mode === 'edit'} />
                    </Form.Item>
                    <Form.Item<Tracking> label="事件类型" name="eventType" required>
                        <Checkbox.Group options={eventTypeOptions} />
                    </Form.Item>
                    <Form.Item<Tracking>
                        label="同级元素是否生效"
                        name="isSiblingEffective"
                        required
                    >
                        <Radio.Group options={radioOptions} />
                    </Form.Item>
                    <Form.Item<Tracking> label="埋点快照" name="snapshot" required>
                        <ImageItem></ImageItem>
                    </Form.Item>
                    <Form.Item<Tracking> label="数据来源" name="datasource">
                        <DataCollection
                            mode={mode}
                            ref={tableRef}
                            sendMessage={sendMessage}
                            onDeleteRow={onDeleteRow}
                            onClickRule={onClickRule}
                        ></DataCollection>
                    </Form.Item>
                </Form>
            </FormDrawer>
            <RuleModal
                title={mode === 'create' ? '添加验证规则' : '编辑验证规则'}
                open={showRuleModal}
                reg={currentRow?.reg}
                isRequired={currentRow?.isRequired}
                onRuleSubmit={onRuleSubmit}
                onCancel={toggleShowRuleModal}
            ></RuleModal>
        </>
    )
}

export default TrackingDrawer
