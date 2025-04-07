import type { TableColumnsType, ModalProps } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Modal, Table, Tag } from 'antd'
import { RuleRequiredEnum, ValidationResultEnum } from '@/constants/enums'

interface LogModalProps extends ModalProps {
    data: ValidationInfo[]
}

export interface ValidationInfo {
    fieldName: string
    fieldValue?: string
    reg?: string
    isRequired?: RuleRequiredEnum
    validationResult?: ValidationResultEnum
}

const LogModal: React.FC<LogModalProps> = (props) => {
    const { data } = props

    const columns: TableColumnsType<ValidationInfo> = [
        {
            title: '字段名称',
            dataIndex: 'fieldName',
            key: 'fieldName',
            align: 'center',
        },
        {
            title: '是否必填',
            dataIndex: 'isRequired',
            key: 'isRequired',
            align: 'center',
            width: 100,
            render: (text) => {
                return text === RuleRequiredEnum.YES ? '是' : '否'
            },
        },
        {
            title: '正则表达式',
            dataIndex: 'reg',
            key: 'reg',
            align: 'center',
        },
        {
            title: '字段值',
            dataIndex: 'fieldValue',
            key: 'fieldValue',
            align: 'center',
        },
        {
            title: '验证结果',
            dataIndex: 'validationResult',
            key: 'validationResult',
            align: 'center',
            render: (text) => {
                return text === ValidationResultEnum.Success ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                        通过
                    </Tag>
                ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                        未通过
                    </Tag>
                )
            },
        },
    ]

    return (
        <Modal title="参数校验结果" {...props} width={800}>
            <Table
                rowKey="fieldName"
                className="uno-h-[500px]"
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </Modal>
    )
}

export default LogModal
