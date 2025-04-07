import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import alias from '@rollup/plugin-alias'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { dts } from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import pkg from '../package.json' assert { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const srcDir = fileURLToPath(new URL('../src', import.meta.url))

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/es/index.esm.js',
                format: 'esm',
                sourcemap: true,
                compact: true,
            },
            {
                file: 'dist/umd/index.umd.js',
                format: 'umd',
                name: pkg.buildOptions.globalName,
                sourcemap: true,
                compact: true,
                minifyInternalExports: true,
            },
            // 输出一份给测试项目用
            {
                file: join(__dirname, '../../../examples/vue-test-project/public/index.umd.js'),
                format: 'umd',
                name: pkg.buildOptions.globalName,
                sourcemap: false,
                exports: 'default',
            },
            {
                file: join(__dirname, '../../../examples/react-test-project/public/index.umd.js'),
                format: 'umd',
                name: pkg.buildOptions.globalName,
                sourcemap: false,
                exports: 'default',
            },
            {
                file: join(__dirname, '../../../examples/Vue-mmPlayer/public/index.umd.js'),
                format: 'umd',
                name: pkg.buildOptions.globalName,
                sourcemap: false,
                exports: 'default',
            },
        ],
        plugins: [
            esbuild({
                target: 'es2015',
                minify: true,
                treeShaking: true,
                drop: ['debugger', 'console'],
            }),
            resolve({ browser: true }),
            commonjs({
                extensions: ['.ts'],
            }),
        ],
        treeshake: {
            moduleSideEffects: false,
        },
        // perf: true,
    },
    {
        input: 'src/index.ts',
        plugins: [
            alias({
                entries: { '@': srcDir },
            }),
            dts(),
        ],
        output: {
            file: 'dist/types/index.d.ts',
            format: 'es',
        },
    },
]
