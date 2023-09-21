import type Cesium from 'cesium'
declare global {
  type ICesium = typeof Cesium
  interface Window {
    $alert?: Function
    $Cesium: typeof Cesium
    [key: string]: any
  }
}
declare module 'BMap' {
  const BMap: any // 或者根据实际情况声明 BMap 的类型
  export = BMap
}
