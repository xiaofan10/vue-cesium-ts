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

  // 自定义道路
  route(path, style) {
    return this.polyline(path, style)
  }

  marker(options) {
    const { BMap } = this
    const {
      url = '/assets/images/markers.png',
      point,
      width,
      height,
      offset = [0, 0],
      imageOffset = [0, 0]
    } = options
    const myIcon = new BMap.Icon(url, new BMap.Size(width, height), {
      anchor: new BMap.Size(...offset),
      imageOffset: new BMap.Size(...imageOffset)
    })
    const marker = new BMap.Marker(point, { icon: myIcon })
    marker.setTop(true)
    return marker
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
