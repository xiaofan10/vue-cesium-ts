import * as Cesium from 'cesium'
import Material from './material'

export const INJECT_CESIUM_EXTEND = () => {
  new Material(Cesium)
}
