import { defineConfig, mergeConfig } from 'vite'

import DEV_CONFIG from './vite/vite.dev.config.js'
import PROD_CONFIG from './vite/vite.prod.config.js'
import BASE_CONFIG from './vite/vite.base.config.js'

const config = {
  prod: () => mergeConfig(Object.assign({}, BASE_CONFIG), PROD_CONFIG),
  dev: () => mergeConfig(Object.assign({}, BASE_CONFIG), DEV_CONFIG)
}

export default defineConfig(({ mode }) => {
  return config[mode]()
})
