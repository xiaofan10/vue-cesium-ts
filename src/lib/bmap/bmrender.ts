import InstallBMap from './bmap'
import Model from './model'
import Handler from './handler'
import Event from './event'
import Shape from './shape'

const defaultStyle = {
  strokeColor: '#f00',
  strokeOpacity: 0.5,
  strokeWeight: 6,
  enableMassClear: true
}

const hoverStyle = {
  strokeOpacity: 1,
  strokeWeight: 10
}

class BMRender {
  BMap: any
  model: Model | any
  handler: Handler | any
  event: Event | any
  bmap: any
  onLoad?: Function
  shape: Shape | any

  constructor(options) {
    const { onLoad } = options
    this.event = new Event()
    if (onLoad) {
      this.onLoad = onLoad.bind(this)
      this.on('load', this.onLoad as Function)
    }
    this.init()
  }

  async init() {
    const BMap = await InstallBMap.init()
    this.BMap = BMap
    this.model = new Model(this.BMap)
    this.shape = new Shape(this.BMap)
    this.handler = new Handler()
    this.event.emit('load')
  }

  on(event: string, callback: Function) {
    this.event.bind(event, callback)
  }

  off(event: string, callback: Function) {
    this.event.unbind(event, callback)
  }

  draw() {
    const { shape, bmap } = this
    const { graphics } = this.model
    // 待优化
    graphics.forEach((graph) => {
      const style = Object.assign({}, defaultStyle, graph.isHover ? hoverStyle : {})
      const graphInstance = shape[graph.type](graph.path, style)
      graph.overlay = graphInstance
      bmap.addOverlay(graph.overlay)
    })
  }
  updateGraphic(graphic: any, option: any = {}) {
    const style = graphic.isHover ? hoverStyle : {}
    this.shape.update(graphic, style)
  }
}

export default BMRender
