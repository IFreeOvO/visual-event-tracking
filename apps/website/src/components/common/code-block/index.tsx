import { CopyOutlined } from '@ant-design/icons'
import { useMemoizedFn } from 'ahooks'
import { message, Tooltip } from 'antd'
import copy from 'copy-to-clipboard'
import hljs from 'highlight.js/lib/core'
import { LanguageEnum } from '@/constants/enums'
import 'highlight.js/styles/atom-one-dark.css'

interface CodeBlockProps {
    language: LanguageEnum
    code: string
}

const getLanguageModule = (language: LanguageEnum) => {
    switch (language) {
        case LanguageEnum.JS:
            return import('highlight.js/lib/languages/javascript')
        case LanguageEnum.XML:
            return import('highlight.js/lib/languages/xml')
        default:
            return import('highlight.js/lib/languages/javascript')
    }
}

const CodeBlock: React.FC<CodeBlockProps> = (props) => {
    const { code, language = LanguageEnum.JS } = props
    const codeRef = useRef<HTMLElement>(null)

    const highlightCode = useMemoizedFn(async () => {
        if (!hljs.getLanguage(language)) {
            const lang = await getLanguageModule(language)
            hljs.registerLanguage(language, lang.default)
        }

        const highlightedCode = hljs.highlight(code, {
            language,
        }).value
        if (codeRef.current) {
            codeRef.current.innerHTML = highlightedCode
        }
    })

    const onCopy = () => {
        if (copy(code)) {
            message.success('复制成功')
        }
    }

    useEffect(() => {
        highlightCode()
    }, [code, language, highlightCode])

    return (
        <pre className="uno-rounded-[4px] uno-overflow-auto uno-max-h-[400px] uno-relative">
            <Tooltip title="复制">
                <div
                    onClick={onCopy}
                    className="uno-position-absolute uno-rounded-[4px] uno-right-[8px] uno-top-[8px] uno-cursor-pointer uno-h-[30px] uno-w-[30px] uno-flex uno-items-center uno-justify-center uno-bg-[#626161] uno-opacity-[0.5]"
                >
                    <CopyOutlined className="uno-text-white" />
                </div>
            </Tooltip>
            <code ref={codeRef} className="hljs">
                {code}
            </code>
        </pre>
    )
}

export default CodeBlock
