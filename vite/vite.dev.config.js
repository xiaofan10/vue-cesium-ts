import checker from 'vite-plugin-checker'
import { join } from 'path'
import { writeFileSync } from 'fs'

export default {
  plugins: [
    checker({
      typescript: true
    })
  ],
  server: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    port: 8888,
    proxy: {
      '/api': {
        target: 'https://maps.heigit.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/direction': {
        target: 'https://api.map.baidu.com',
        changeOrigin: true
      }
    }
  }
}
