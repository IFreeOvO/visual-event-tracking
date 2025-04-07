import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    plugins: [
      vue2(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'api': fileURLToPath(new URL('./src/api', import.meta.url)),
        'assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        'base': fileURLToPath(new URL('./src/base', import.meta.url)),
        'components': fileURLToPath(new URL('./src/components', import.meta.url)),
        'pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      },
      extensions: ['.vue','.js','.json','.jsx']
    },
    css: {
      preprocessorOptions: {
        less: {
          additionalData: `
            @import "@/styles/var.less";
            @import "@/styles/mixin.less";
          `,
        },
      },
      postcss: {
        plugins: [
          autoprefixer(),
        ],
      },
    },
    server: {
      port: 5600,
      host: true,
    },
  }
})