import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import'
import path from 'path'
import cesium from 'vite-plugin-cesium'
// css 处理
import postCssPxToRem from 'postcss-pxtorem'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    cesium(),
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
    // postcss: {
    //   plugins: [
    //     // postCssPxToRem({
    //     //   // 自适应，px>rem转换
    //     //   rootValue: 16, // 1rem的大小
    //     //   propList: ['*'] // 需要转换的属性，这里选择全部都进行转换
    //     // }),
    //     autoprefixer({
    //       overrideBrowserslist: [
    //         'Android 4.1',
    //         'iOS 7.1',
    //         'Chrome > 31',
    //         'ff > 31',
    //         'ie >= 8'
    //         //'last 2 versions', // 所有主流浏览器最近2个版本
    //       ],
    //       grid: true
    //     })
    //   ]
    // }
  }
})
