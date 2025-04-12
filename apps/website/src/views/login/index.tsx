import type { FormProps } from 'antd'
import { Button, Form, Input, Row, Col, message } from 'antd'
import { login } from '@/api/service/auth'
import { VisibleStatusEnum } from '@/constants/enums'
import { Path } from '@/constants/path'
import useMenuRefresh from '@/hooks/business/use-menu-items'
import useRouter from '@/hooks/common/use-router'
import { Menu } from '@/models/vo/menu.vo'
import { useUserInfo, useToken } from '@/store/user.store'

type FieldType = {
    username: string
    password: string
}
const Login: React.FC = () => {
    const { push } = useRouter()

    const [loginLoading, setLoginLoading] = useImmer(false)

    const [, updateUserInfo] = useUserInfo()
    const [, updateToken] = useToken()
    const refreshMenuItems = useMenuRefresh()

    const onFinish: FormProps<FieldType>['onFinish'] = (data) => {
        setLoginLoading(true)
        login(data)
            .then(async ([err, res]) => {
                if (!err) {
                    const { accessToken, user } = res.data
                    updateToken(accessToken)
                    if (user) {
                        updateUserInfo(user)
                    }
                    const newMenus = (await refreshMenuItems()) ?? []

                    message.open({
                        content: '登录成功',
                        type: 'success',
                    })
                    const path = getFirstPagePath(newMenus)
                    push(path)
                }
            })
            .finally(() => {
                setLoginLoading(false)
            })
    }

    return (
        <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
            initialValues={{ username: 'admin', password: '123456' }}
            onFinish={onFinish}
            autoComplete="off"
        >
            <Form.Item<FieldType>
                label="用户名"
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item<FieldType>
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
            >
                <Input.Password />
            </Form.Item>

            <Row>
                <Col span={24}>
                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        block
                        className="uno-rounded-full"
                        loading={loginLoading}
                    >
                        登录
                    </Button>
                </Col>
            </Row>
            <Row className="uno-mt-4">
                <Col span={24}>
                    <Button
                        size="large"
                        onClick={() => push(Path.Register)}
                        block
                        className="uno-rounded-full"
                    >
                        注册
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}

export default Login

/**
 *
 * @remarks 获取登录后的跳转的第一个页面路径
 */
function getFirstPagePath(menus: Menu[]) {
    let path = ''
    const parentMenu = menus.find(
        (menu) => menu.parentId === 0 && menu.visibleStatus === VisibleStatusEnum.Visible,
    )
    const firstChildMenu = menus.find(
        (menu) =>
            menu.parentId === parentMenu?.id && menu.visibleStatus === VisibleStatusEnum.Visible,
    )
    if (parentMenu && firstChildMenu) {
        path = `/${parentMenu.path}/${firstChildMenu.path}`
    } else if (parentMenu && !firstChildMenu) {
        path = `${parentMenu.path}`
    }

    return path
}
