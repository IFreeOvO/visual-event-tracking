import type { ModalProps, FormInstance } from 'antd'
import { Form, Input, Modal, Radio } from 'antd'
import { RuleRequiredEnum } from '@/constants/enums'
import { TrackingDatasourceRule } from '@/models/vo/tracking.vo'

export interface RuleModalProps extends ModalProps {
    reg?: string
    isRequired?: RuleRequiredEnum
    onRuleSubmit?: (values: TrackingDatasourceRule, form: FormInstance) => void
}

const RuleModal: React.FC<RuleModalProps> = (props) => {
    const { onRuleSubmit, reg, isRequired, ...resetProps } = props
    const [form] = Form.useForm()
    const onFinish = (values: TrackingDatasourceRule) => {
        onRuleSubmit && onRuleSubmit(values, form)
    }

    useEffect(() => {
        form.setFieldsValue({
            reg,
            isRequired,
        })
    }, [reg, isRequired, form])

    return (
        <Modal
            {...resetProps}
            onOk={() => {
                form.submit()
            }}
        >
            <Form autoComplete="off" onFinish={onFinish} form={form}>
                <Form.Item<TrackingDatasourceRule> label="校验规则" name="reg">
                    <Input placeholder="请输入正则表达式" />
                </Form.Item>
                <Form.Item<TrackingDatasourceRule>
                    label="是否必传"
                    name="isRequired"
                    initialValue={RuleRequiredEnum.NO}
                >
                    <Radio.Group>
                        <Radio value={RuleRequiredEnum.NO}>否</Radio>
                        <Radio value={RuleRequiredEnum.YES}>是</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default RuleModal
