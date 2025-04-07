import { fileURLToPath, URL } from 'node:url'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import { dts } from 'rollup-plugin-dts'
import nodePolyfills from 'rollup-plugin-polyfill-node'

const srcDir = fileURLToPath(new URL('../src', import.meta.url))

export default [
    {
        input: 'src/main.ts',
        plugins: [
            alias({
                entries: { '@': srcDir },
            }),
            swc({
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
        ],
        output: {
            dir: 'dist/es',
            format: 'es',
            sourcemap: 'inline',
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
