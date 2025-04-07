import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Layout, Menu, MenuProps, theme } from 'antd'
import useRouter from '@/hooks/common/use-router'
import GlobalHeader from './components/global-header'
import useBreadcrumb from './hooks/use-breadcrumb'
import useMenuItems from './hooks/use-menu-items'

const { Header, Sider, Content } = Layout

const DefaultLayout: React.FC = () => {
    const { push } = useRouter()
    const {
        token: { colorBgContainer, borderRadiusLG, colorPrimaryBg },
    } = theme.useToken()
    const menuItems = useMenuItems()
    const breadcrumb = useBreadcrumb()
    const [collapsed, setCollapsed] = useImmer(false)

    const onClickMenu: MenuProps['onClick'] = ({ key }) => {
        push(key)
    }

    return (
        <>
            <Layout
                id="default-layout"
                className="uno-h-full"
                style={{
                    background: colorPrimaryBg,
                }}
            >
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <h3 className="uno-px-2 uno-text-center uno-text-white uno-text-xl">
                        可视化埋点系统
                    </h3>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={menuItems}
                        onClick={onClickMenu}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }}>
                        <div className="uno-h-full uno-flex uno-items-center">
                            <Button
                                className="uno-flex-shrink-0"
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <GlobalHeader breadcrumb={breadcrumb}></GlobalHeader>
                        </div>
                    </Header>
                    <Content
                        style={{
                            padding: '24px 16px',
                            minHeight: 280,
                            background: colorPrimaryBg,
                            borderRadius: borderRadiusLG,
                            overflow: 'hidden',
                            display: 'flex',
                        }}
                    >
                        <div className="uno-flex-1 uno-w-full">
                            <Outlet></Outlet>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default DefaultLayout
