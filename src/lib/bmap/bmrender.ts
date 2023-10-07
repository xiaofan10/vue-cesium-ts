import InstallBMap from './bmap'
import Model from './model'
import Handler from './handler'
import Event from './event'
import Shape from './shape'
import { graphic } from 'echarts'

const strokeColor = ['#f00', '#ff9900', '#0f0', '00f']

const defaultStyle = {
  strokeOpacity: 0.8,
  strokeWeight: 5,
  enableMassClear: true
}

const hoverStyle = {
  strokeOpacity: 1,
  strokeWeight: 8
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
    this.hover = this.hover.bind(this)
    this.reset = this.reset.bind(this)
    this.event = new Event()
    if (onLoad) {
      this.onLoad = onLoad.bind(this)
      this.on('load', this.onLoad as Function)
    }
    this.init()
  }

  setBmap(bmap) {
    this.bmap = bmap
    return this
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

  addGraphic(graphic: any) {
    const { shape } = this
    if (Array.isArray(graphic)) {
      graphic.forEach((item) => {
        const num = this.model.getGraphicNum()
        console.log(num)
        const graphInstance = shape[item.type](item.path, {
          ...defaultStyle,
          strokeColor: strokeColor[num]
        })
        this.bind(graphInstance, 'mouseover', this.hover)
        this.bind(graphInstance, 'mouseout', this.reset)
        item.overlay = graphInstance
        this.model.addGraphic(item)
      })
    } else {
      const graphInstance = shape[graphic.type](graphic.path, defaultStyle)
      this.bind(graphInstance, 'mouseover', this.hover)
      this.bind(graphInstance, 'mouseout', this.reset)
      graphic.overlay = graphInstance
      this.model.addGraphic(graphic)
    }
    return this
  }

  getGraphic(id?) {
    if (id) {
      return this.model.getGraphic()
    } else {
      return this.model.getGraphic()
    }
  }

  clear() {
    const { bmap } = this
    const graphics = this.getGraphic()
    const hoverGraphics = this.model.getHoverGraphics()
    graphics.forEach((graph) => {
      bmap.removeOverlay(graph.overlay)
    })
    hoverGraphics.forEach((graph) => {
      bmap.removeOverlay(graph.overlay)
    })
  }

  draw() {
    const { shape, bmap } = this
    const graphics = this.getGraphic()
    const hoverGraphics = this.model.getHoverGraphics()
    graphics.forEach((graph) => {
      bmap.addOverlay(graph.overlay)
      if (graph.type === 'route') {
        const start = graph.path[0]
        const end = graph.path[graph.path.length - 1]
        const startGraphInstance = shape['marker']({
          point: start,
          width: 42,
          height: 34,
          offset: [14, 32],
          imageOffset: [0, 0]
        })
        const endGraphInstance = shape['marker']({
          point: end,
          width: 42,
          height: 34,
          offset: [14, 32],
          imageOffset: [0, -34]
        })
        graph.marker = []
        graph.marker.push(startGraphInstance)
        graph.marker.push(endGraphInstance)
        graph.marker.forEach((item) => {
          bmap.addOverlay(item)
        })
      }
    })
  }

  updateGraphic(graphic: any, option: any = {}) {
    this.shape.update(graphic, option)
  }

  hover(e) {
    const { currentTarget } = e
    const hoversMap = this.model.getHoverGraphicsMap()
    const hovers = this.model.getHoverGraphics()

    this.model.getGraphic().forEach((graphic) => {
      if (graphic.overlay === currentTarget) {
        if (hoversMap[graphic.id]) return
        console.log(graphic.levels)
        if (hovers.length > 0 && hovers[0].levels < graphic.levels) {
          this.reset()
        }
        graphic.hoverOverlay = new this.BMap.Polyline(graphic.path, {
          strokeColor: '#a8fe22',
          strokeWeight: 6,
          setStrokeStyle: 'dashed',
          strokeOpacity: 1
        })
        this.bmap.addOverlay(graphic.hoverOverlay)
        // graphic.overlay.hide()
        this.model.addHoverGraphic(graphic)
      }
    })
  }

  reset() {
    const hoverGraphics = this.model.getHoverGraphics()
    hoverGraphics.forEach((graphic) => {
      graphic.isHover = false
      this.bmap.removeOverlay(graphic.hoverOverlay)
      // graphic.overlay.show()
    })
    this.model.removeAllHoverGraphic()
  }

  bind(graphfic, event, callback) {
    graphfic.addEventListener(event, callback)
    return this
  }

  unBind(graphic, event, callback) {
    graphic.removeEventListener(event, callback)
    return this
  }
}

export default BMRender
