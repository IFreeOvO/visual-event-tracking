import { PoweroffOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import { Path } from '@/constants/path'
import useRouter from '@/hooks/common/use-router'
import { removeAuth } from '@/shared/auth'
import { useUserInfo } from '@/store/user.store'

const UserAvatar: React.FC = () => {
    const [userInfo] = useUserInfo()
    const { push } = useRouter()

    const onLoginOut = () => {
        removeAuth()
        push(Path.Login)
    }

    const items: MenuProps['items'] = [
        {
            label: (
                <div onClick={onLoginOut}>
                    <Space>
                        <PoweroffOutlined />
                        <span>退出登录</span>
                    </Space>
                </div>
            ),
            key: '0',
        },
    ]

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Button
                size="large"
                type="text"
                block
                className="uno-mr-4 uno-border-0 uno-shadow-none uno-w-[120px]!"
            >
                <div id="user-avatar" className=" uno-flex uno-items-center">
                    <Space>
                        <div
                            uno-border="~ gray-700 solid"
                            className="uno-rounded-full uno-w-[24px] uno-h-[24px] "
                        >
                            <UserOutlined className="uno-text-[18px]" />
                        </div>

                        <span className="uno-text-[18px]">{userInfo.username}</span>
                    </Space>
                </div>
            </Button>
        </Dropdown>
    )
}

export default UserAvatar
