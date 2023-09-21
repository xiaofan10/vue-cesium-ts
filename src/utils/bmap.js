export default {
  getAK() {
    return 'sSu2GGscTW2TNPUhgxfNgGqDa1lODeI3' //
  },
  init: function () {
    const AK = this.getAK()
    const ON_BMAP_CALLBACK = 'onBMapLoad'
    const BMap_URL = `https://api.map.baidu.com/api?v=3.0&ak=${AK}&s=1&callback=${ON_BMAP_CALLBACK}`

    return new Promise((resolve) => {
      // 百度地图异步加载回调处理
      window[ON_BMAP_CALLBACK] = () => {
        resolve(BMap)
      }
      // 如果已加载直接返回
      if (typeof BMap !== 'undefined') {
        resolve(BMap)
        return true
      }
      // 插入script脚本
      let scriptNode = document.createElement('script')
      scriptNode.setAttribute('type', 'text/javascript')
      scriptNode.setAttribute('src', BMap_URL)
      document.body.appendChild(scriptNode)
    })
  }
}
