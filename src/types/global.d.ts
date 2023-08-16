import type Cesium from 'cesium'
declare global {
  type ICesium = typeof Cesium
  interface Window {
    $alert?: Function
    $Cesium: typeof Cesium
    [key: string]: any
  }
}
