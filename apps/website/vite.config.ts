import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react-swc'
import postcssPresetEnv from 'postcss-preset-env'
// import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import pkg from './package.json'
import { staticImportedByEntry } from './vite-util'

const isDev = process.env.NODE_ENV === 'development'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        UnoCSS(),
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
        createHtmlPlugin({
            inject: {
                data: {
                    appName: pkg.description,
                },
            },
        }),
        // visualizer(),
    ],
    css: {
        postcss: {
            plugins: [postcssPresetEnv()],
        },
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
        extensions: ['.ts', '.tsx', '.js'],
    },
    server: {
        port: 8000,
        host: 'localhost',
    },
    esbuild: {
        drop: isDev ? [] : ['console', 'debugger'],
    },
    build: {
        target: 'es2015',
        minify: isDev ? false : 'esbuild',
        assetsInlineLimit: 1024 * 10,
        rollupOptions: {
            onwarn(warning, defaultHandler) {
                if (warning.code === 'EVAL') {
                    return
                }
                if (warning.code === 'EMPTY_BUNDLE') {
                    return
                }
                defaultHandler(warning)
            },
            output: {
                entryFileNames: 'js/main-[name]-[hash].js',
                chunkFileNames: 'js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
                manualChunks(id, { getModuleInfo }) {
                    const cache = new Map()
                    if (
                        id.includes('node_modules') &&
                        staticImportedByEntry(id, getModuleInfo, cache)
                    ) {
                        const res = id.toString().match(/\/node_modules\/(?!\.pnpm)([^/]*)\//)
                        const packageName = res?.[1]

                        if (packageName === 'hooks') {
                            if (id.includes('lodash')) return 'lodash'
                        }
                        if (packageName === 'antd') {
                            if (id.includes('antd/es/table')) {
                                return 'antd-table'
                            }
                            const antdComponents = [
                                'menu',
                                'breadcrumb',
                                'badge',
                                'card',
                                'steps',
                                'tree',
                                'pagination',
                                'tabs',
                                'message',
                                'spin',
                            ]
                            const matchedComponent = antdComponents.find((comp) =>
                                id.includes(comp),
                            )
                            if (matchedComponent) {
                                return `antd-${matchedComponent}`
                            }
                        }

                        return packageName ?? 'vendor'
                    }
                },
            },
        },
    },
})
