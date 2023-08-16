import { Scene } from 'cesium'
declare module 'cesium' {
  interface Scene {
    RadarLineMaterialProperty: any
  }
}
