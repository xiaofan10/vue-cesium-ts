import * as Cesium from 'cesium'
import { RadarLineMaterialProperty } from '../material/RadarLineMaterialProperty'
import { RadarScanMaterialProperty } from '../material/RadarScanMaterialProperty'
import { PolylineDynamicMaterialProperty } from '../material/PolylineDynamicMaterialProperty'
import { PolylineLightMaterialProperty } from '../material/PolylineLightMaterialProperty'
export const createMaterialProperty = (type, options: any = {}) => {
  switch (type) {
    case 'RadarLine':
      return new RadarLineMaterialProperty(options)
    case 'RadarScan':
      return new RadarScanMaterialProperty(options)
    case 'PolylineDynamic':
      return new PolylineDynamicMaterialProperty(options)
    case 'PolylineLight':
      return new PolylineLightMaterialProperty(options)
    default:
  }
}
