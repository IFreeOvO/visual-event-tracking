import { fileURLToPath, URL } from 'node:url'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import { minify as minifySwc } from '@swc/core'
import { dts } from 'rollup-plugin-dts'
import nodePolyfills from 'rollup-plugin-polyfill-node'
// import { visualizer } from 'rollup-plugin-visualizer'

const srcDir = fileURLToPath(new URL('../src', import.meta.url))

export default [
    {
        input: 'src/main.ts',
        plugins: [
            alias({
                entries: { '@': srcDir },
            }),
            swc({
                minify: true,
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        decorators: true,
                    },
                    target: 'es2015',
                    transform: {
                        legacyDecorator: true,
                        decoratorMetadata: true,
                    },
                },
            }),
            commonjs({
                extensions: ['.js', '.ts'],
            }),
            nodePolyfills(),
            resolve({
                browser: true,
                extensions: ['.ts'],
            }),
            swcMinify(),
            // visualizer(),
        ],
        output: {
            dir: 'dist/es',
            format: 'es',
            compact: true,
        },
        onwarn(warning, warn) {
            if (warning.code === 'EVAL') return
            warn(warning)
        },
    },
    {
        input: 'src/main.ts',
        plugins: [
            alias({
                entries: { '@': srcDir },
            }),
            dts(),
        ],
        output: {
            file: 'dist/global.d.ts',
            format: 'es',
        },
    },
]

function swcMinify() {
    return {
        name: 'swc-minify',
        async renderChunk(contents) {
            const { code } = await minifySwc(contents, {
                module: true,
                format: {
                    comments: false,
                },
                compress: {
                    ecma: 2015,
                    pure_getters: true,
                },
                mangle: true,
            })

            return { code: code, map: null }
        },
    }
}
