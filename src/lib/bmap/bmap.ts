export default {
  getAK() {
    return 'sSu2GGscTW2TNPUhgxfNgGqDa1lODeI3'
  },
  init: function () {
    return new Promise((resolve) => {
      const ON_BMAP_CALLBACK = 'onBMapLoad'
      // 百度地图异步加载回调处理
      window[ON_BMAP_CALLBACK] = () => {
        console.log(23423423)
        // @ts-ignore
        resolve(BMap)
      }
      // 如果已加载直接返回
      // @ts-ignore
      if (typeof BMap !== 'undefined') {
        // @ts-ignore
        resolve(BMap)
        return true
      }
      console.log(1111)
      const AK = this.getAK()
      const BMap_URL = `https://api.map.baidu.com/api?v=3.0&ak=${AK}&s=1&callback=${ON_BMAP_CALLBACK}`

      // 插入script脚本
      const scriptNode: HTMLScriptElement = document.createElement('script')
      scriptNode.setAttribute('type', 'text/javascript')
      scriptNode.setAttribute('src', BMap_URL)
      document.body.appendChild(scriptNode)
    })
  }
}
