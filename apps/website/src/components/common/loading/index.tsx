import { Spin, SpinProps } from 'antd'

const Loading: React.FC<SpinProps> = (props) => {
    const { size = 'large', ...resetProps } = props
    return (
        <Spin size={size} {...resetProps} className={`uno-center uno-h-full ${props.className}`}>
            {props.children}
        </Spin>
    )
}

export default Loading
