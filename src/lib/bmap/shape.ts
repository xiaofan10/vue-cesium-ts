class Shape {
  // 构造器
  BMap: any
  model: any
  constructor(BMap) {
    this.BMap = BMap
  }
  polyline(path, style) {
    const { BMap } = this
    const graphic = new BMap.Polyline(path, style)
    return graphic
  }

  update(graphfic, option) {
    const { path, strokeColor, strokeOpacity, strokeWeight, strokeStyle } = option
    path && graphfic.setPath(path)
    strokeColor && graphfic.setStrokeColor(strokeColor)
    typeof strokeOpacity === 'number' && graphfic.setStrokeOpacity(strokeOpacity)
    strokeWeight && graphfic.setStrokeWeight(strokeWeight)
    strokeStyle && graphfic.setStrokeStyle(strokeStyle)
  }
}

export default Shape
