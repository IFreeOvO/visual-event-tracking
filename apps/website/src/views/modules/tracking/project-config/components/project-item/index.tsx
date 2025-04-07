import { BugOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { Avatar, Button, Card, Popover, Tooltip } from 'antd'
import { Path } from '@/constants/path'
const { Meta } = Card

export interface ProjectItemProps {
    id: number
    title: string
    desc?: string
    onDelete?: (id: number) => void
    onEdit?: (id: number) => void
    onDebug?: (id: number) => void
    url?: string
}

const ProjectItem: React.FC<ProjectItemProps> = (props) => {
    const { title, desc, id, url = '', onDelete, onEdit, onDebug } = props
    const colorList = [
        '#f56a00',
        '#7265e6',
        '#ffbf00',
        '#00a2ae',
        '#c9f138',
        '#4096ff',
        '#efdbff',
        '#722ed1',
        '#eb2f96',
        '#f3eb06',
    ]

    const ProjectAvatar = memo(() => (
        <Avatar
            style={{ backgroundColor: colorList[id % colorList.length], verticalAlign: 'middle' }}
            size="large"
        >
            {title.slice(0, 1)}
        </Avatar>
    ))

    const handleEdit = useMemoizedFn(() => {
        if (onEdit) {
            onEdit(id)
        }
    })

    const handleDelete = useMemoizedFn(() => {
        if (onDelete) {
            onDelete(id)
        }
    })

    const handleDebug = useMemoizedFn(() => {
        if (onDebug) {
            onDebug(id)
        }
    })

    const Actions = useMemo(() => {
        return [
            <Tooltip title="项目配置">
                <SettingOutlined key="setting" onClick={handleEdit} />
            </Tooltip>,
            <Tooltip title="埋点验证">
                <BugOutlined key="debug" onClick={handleDebug} />
            </Tooltip>,
            <Popover
                content={
                    <Button danger type="text" onClick={handleDelete}>
                        删除项目
                    </Button>
                }
                trigger="click"
            >
                <EllipsisOutlined key="ellipsis" />
            </Popover>,
        ]
    }, [handleEdit, handleDelete, handleDebug])

    return (
        <Card actions={Actions}>
            <Link to={`${Path.Editor}/${id}?name=${title}&url=${encodeURIComponent(url)}`}>
                <Meta
                    avatar={<ProjectAvatar />}
                    title={title}
                    description={<div className="uno-line-clamp-2 uno-h-[44px]">{desc}</div>}
                />
            </Link>
        </Card>
    )
}

export default ProjectItem
