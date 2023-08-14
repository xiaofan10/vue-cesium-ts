import path from 'path'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import'
import cesium from 'vite-plugin-cesium'
import postcssPresetEnv from 'postcss-preset-env'
import pxToRem from 'postcss-pxtorem'

// 获取文件当前路径 也可以直接使用__dirname
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  // eslint-disable-next-line no-undef
  envDir: path.join(process.cwd(), '/env'),
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
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, '../src')
    }
  },
  css: {
    postcss: {
      plugins: [
        pxToRem({
          rootValue: 16,
          unitPrecision: 5,
          propList: ['*'],
          selectorBlackList: [],
          replace: true,
          mediaQuery: false,
          minPixelValue: 0,
          exclude: /node_modules/i
        }),
        postcssPresetEnv()
      ]
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        // eslint-disable-next-line no-undef
        additionalData: `@import "${path.resolve(
          __dirname,
          '../src/components/mars-ui/base.less'
        )}";`
      }
    }
  }
})
