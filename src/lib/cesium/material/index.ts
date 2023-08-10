import { installRadarLineMaterialProperty } from './RadarLineMaterialProperty'
// import type Cesium from 'cesium'

function loadShaderFromFile(filename: URL) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', filename, true)
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        resolve(request.responseText)
      } else {
        reject()
      }
    }
    request.send()
  })
}

export default class Material {
  Cesium: any
  constructor(Cesium: any) {
    this.Cesium = Cesium
    this._installMaterial(Cesium)
  }

  _installMaterial(Cesium: any) {
    // ellipse 雷达材质
    installRadarLineMaterialProperty(Cesium)
  }
}
