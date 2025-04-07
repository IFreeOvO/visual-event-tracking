import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/assets/styles/index.scss'
import 'virtual:uno.css'
import { token } from '@/theme/vars'
import AppRouter from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider
            locale={zhCN}
            theme={{
                token,
            }}
        >
            <AppRouter></AppRouter>
        </ConfigProvider>
    </React.StrictMode>,
)
