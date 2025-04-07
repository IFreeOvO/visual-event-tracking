import { Breadcrumb, BreadcrumbProps } from 'antd'
import UserAvatar from '../user-avatar'

interface GlobalHeaderProps {
    breadcrumb: BreadcrumbProps['items']
}

const GlobalHeader: React.FC<GlobalHeaderProps> = (props) => {
    return (
        <div
            className="uno-f-hull uno-flex uno-items-center uno-justify-between uno-flex-1"
            id="global-header"
        >
            <Breadcrumb items={props.breadcrumb} />
            <UserAvatar></UserAvatar>
        </div>
    )
}

export default GlobalHeader
