import { installRadarLineMaterialProperty } from './RadarLineMaterialProperty'
import { installRadarScanMaterialProperty } from './RadarScanMaterialProperty'
import { installPolylineLightMaterialProperty } from './PolylineLightMaterialProperty'
import { installPolylineDynamicMaterialProperty } from './PolylineDynamicMaterialProperty'
import { installWallDynamicMaterialProperty } from './WallDynamicMaterialProperty'

export default class Material {
  Cesium: any
  constructor(Cesium: any) {
    this.Cesium = Cesium
    this._installMaterial(Cesium)
  }

  private _installMaterial(Cesium: any) {
    // ellipse 雷达材质
    installRadarLineMaterialProperty(Cesium)
    installRadarScanMaterialProperty(Cesium)
    installPolylineLightMaterialProperty(Cesium)
    installPolylineDynamicMaterialProperty(Cesium)
    installWallDynamicMaterialProperty(Cesium)
  }
}
