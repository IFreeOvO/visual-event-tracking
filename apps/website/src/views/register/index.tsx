import type { FormProps } from 'antd'
import { useCountDown } from 'ahooks'
import { Button, Form, Input, Row, Col, message } from 'antd'
import { register, sendCaptcha } from '@/api/service/auth'
import useRouter from '@/hooks/common/use-router'

type FieldType = {
    username: string
    password: string
    confirmPassword?: string
    email: string
    captcha: string
}

const Register: React.FC = () => {
    const { back } = useRouter()
    const [deadline, setDeadline] = useState<number>(0)
    const [registerLoading, setRegisterLoading] = useImmer(false)
    const [showCountDown, toggleCountDownStatus] = useImmer(false)
    const [form] = Form.useForm()

    const [countdown] = useCountDown({
        targetDate: deadline,
        onEnd: () => {
            toggleCountDownStatus(false)
        },
    })

    const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
        delete data.confirmPassword
        setRegisterLoading(true)

        register(data)
            .then(([err]) => {
                if (!err) {
                    message.open({
                        content: '注册成功',
                        type: 'success',
                    })
                    back()
                }
            })
            .finally(() => {
                setRegisterLoading(false)
            })
    }

    const onSendCaptcha = async () => {
        const { email } = await form.validateFields(['email'])
        if (showCountDown) {
            return
        }

        sendCaptcha({ to: email }).then(([err]) => {
            if (!err) {
                toggleCountDownStatus(true)
                setDeadline(Date.now() + 1000 * 60)
                message.open({
                    content: '验证码已发送，请查看邮箱',
                    type: 'success',
                })
            }
        })
    }

    return (
        <Form
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input maxLength={10} />
            </Form.Item>
            <Form.Item<FieldType>
                label="密码"
                name="password"
                rules={[
                    { required: true, message: '请输入密码' },
                    {
                        min: 6,
                        message: '密码不能少于 6 位',
                    },
                ]}
            >
                <Input.Password autoComplete="off" maxLength={50} />
            </Form.Item>
            <Form.Item<FieldType>
                label="确认密码"
                name="confirmPassword"
                rules={[
                    { required: true, message: '请再次输入密码' },
                    {
                        min: 6,
                        message: '密码不能少于 6 位',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve()
                            }
                            return Promise.reject(new Error('两次输入的密码不一致，请重新输入'))
                        },
                    }),
                ]}
            >
                <Input.Password autoComplete="off" maxLength={50} />
            </Form.Item>
            <Form.Item<FieldType>
                label="邮箱"
                name="email"
                rules={[
                    { required: true, message: '请输入邮箱' },
                    {
                        type: 'email',
                        message: '请输入有效的邮箱格式',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item<FieldType>
                label="验证码"
                name="captcha"
                rules={[{ required: true, message: '请输入验证码' }]}
            >
                <Row gutter={8}>
                    <Col span={12}>
                        <Input maxLength={6} />
                    </Col>
                    <Col span={12}>
                        <Button onClick={onSendCaptcha} disabled={showCountDown}>
                            {showCountDown
                                ? `${Math.round(countdown / 1000)}秒后重新获取`
                                : '发送验证码'}
                        </Button>
                    </Col>
                </Row>
            </Form.Item>

            <Row>
                <Col span={24}>
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        block
                        className="uno-rounded-full"
                        loading={registerLoading}
                    >
                        注册
                    </Button>
                </Col>
            </Row>
            <Row className="uno-mt-4">
                <Col span={24}>
                    <Button size="large" onClick={back} block className="uno-rounded-full">
                        返回
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default Register
