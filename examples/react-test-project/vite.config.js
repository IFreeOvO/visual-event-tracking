import dns from 'dns'
import fs from 'fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import postcssPresetEnv from 'postcss-preset-env'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'

dns.setDefaultResultOrder('verbatim')
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        AutoImport({
            imports: [
                'react',
                'react-router-dom',
                {
                    'use-immer': ['useImmer'],
                },
            ],
            dts: !fs.existsSync(new URL('./auto-imports.d.ts', import.meta.url)),
            eslintrc: {
                enabled: !fs.existsSync(new URL('./.eslintrc-auto-import.json', import.meta.url)),
            },
        }),
    ],
    css: {
        postcss: {
            plugins: [postcssPresetEnv()],
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5200,
        host: 'localhost',
    },
})
