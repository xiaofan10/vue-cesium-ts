import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            if (name == 'auto-complete') {
              return ''
            }
            return `ant-design-vue/es/${name}/style/index`
          }
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: `@import "${path.resolve(__dirname, 'src/components/mars-ui/base.less')}";`
      }
    }
  }
})
