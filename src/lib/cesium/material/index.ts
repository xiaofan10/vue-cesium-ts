// import { installRadarLineMaterialProperty } from './RadarLineMaterialProperty'

import { installWallDynamicMaterialProperty } from './WallDynamicMaterialProperty'

export default class Material {
  constructor(Cesium: any) {
    this._installMaterial()
  }

  private _installMaterial() {
    // ellipse 雷达材质

    installWallDynamicMaterialProperty()
  }
}
