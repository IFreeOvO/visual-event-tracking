import { Modal, ModalProps } from 'antd'
import CodeBlock from '@/components/common/code-block'
import { REQUEST_BASE_URL } from '@/constants/domains'
import { LanguageEnum } from '@/constants/enums'
import sdkPkg from '../../../../../../../../../packages/track-client-sdk/package.json'

type SDKModalProps = ModalProps

const SDKModal: React.FC<SDKModalProps> = memo((props) => {
    const { id } = useParams()
    const { width = '80%', ...resetProps } = props

    const npm = `import Tracker from '${sdkPkg.name}'
const tracker = new Tracker({
    serverURL: '${REQUEST_BASE_URL}', // 后端服务域名
    projectId: ${id}, // 项目id
})
tracker.start()`

    const cdn = `<script src="https://unpkg.com/${sdkPkg.name}@${sdkPkg.version}/${sdkPkg.main}"></script>
<script>
    const tracker = new __TRACK_CLIENT_SDK__({
        serverURL: '${REQUEST_BASE_URL}', // 后端服务域名
        projectId: ${id}, // 项目id
    })
    tracker.start()
</script>`

    return (
        <Modal title="sdk用法" {...resetProps} width={width}>
            <h3>npm导入</h3>
            <CodeBlock code={npm} language={LanguageEnum.JS}></CodeBlock>
            <h3>cdn导入</h3>
            <CodeBlock code={cdn} language={LanguageEnum.XML}></CodeBlock>
        </Modal>
    )
})

export default SDKModal
