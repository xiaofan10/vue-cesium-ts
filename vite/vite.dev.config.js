import checker from 'vite-plugin-checker'

export default {
  plugins: [
    checker({
      typescript: true
    })
  ],
  server: {
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
