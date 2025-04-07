import { defineConfig, presetUno, presetAttributify } from 'unocss'

import { token } from './src/theme/vars'
const prefix = 'uno-'
export default defineConfig({
    presets: [
        presetUno({
            prefix,
        }),
        presetAttributify({}),
    ],
    shortcuts: {
        [prefix + 'center']: `${prefix}flex ${prefix}justify-center ${prefix}items-center`,
        [prefix + 'h-center']: `${prefix}flex ${prefix}justify-center`,
        [prefix + 'v-center']: `${prefix}flex ${prefix}items-center`,
        [prefix + 'text-primary']: `${prefix}text-[${token?.colorPrimary}]`,
    },
    theme: {
        breakpoints: {
            sm: '576px',
            md: '768px',
            lg: '992px',
            xl: '1200px',
            '2xl': '1600px',
        },
    },
})
