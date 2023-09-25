class Model {
  BMId: number = 0
  BMap: any
  graphics: any[] = []
  graphicsMap: any = {}
  hoverGraphics: any[] = []
  hoverGraphicsMap: any = {}
  constructor(BMap) {
    this.BMap = BMap
  }
  setId(prefix: string): string {
    return (prefix || '') + '_' + this.BMId++
  }

  getGraphic(): any[] {
    return this.graphics
  }

  getGraphicNum() {
    return this.graphics.length
  }

  addGraphic(graphic: any) {
    if (graphic) {
      if (!graphic.id) {
        graphic.id = this.setId(graphic.type)
        graphic.isHover = false
      }
      this.graphics.push(graphic)
      this.graphicsMap[graphic.id] = graphic
    }
    return this
  }

  removeGraphic(id: string) {
    if (!id) return this
    let index
    let isFind
    this.graphics.forEach(({ graphic, i }) => {
      if (graphic.id === id) {
        index = i
        isFind = true
      }
    })
    if (isFind) {
      this.graphics.splice(index, 1)
      delete this.graphicsMap[id]
    }
    return this
  }

  getHoverGraphics(): any[] {
    return this.hoverGraphics
  }

  addHoverGraphic(graphic: any) {
    this.hoverGraphics.push(graphic)
    this.hoverGraphicsMap[graphic.id] = graphic
    return this
  }

  removeHoverGraphic(id: string) {
    let index
    let isFind
    this.hoverGraphics.forEach((graphic, i) => {
      if (graphic.id === id) {
        graphic.isHover = false
        isFind = true
        index = i
      }
    })
    if (isFind) {
      this.hoverGraphics.splice(index, 1)
      delete this.hoverGraphicsMap[id]
    }
    return this
  }

  removeAll() {
    this.graphics = []
    this.graphicsMap = {}
    this.hoverGraphics = []
  }
}

export default Model
