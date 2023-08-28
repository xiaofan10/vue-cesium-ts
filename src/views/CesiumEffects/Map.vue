<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="0" top="10" bottom="10" width="300" title="Camera">
      <p>
        <a-space>
          <mars-button @click="layers.loadOSM">加载第三方图层</mars-button>
        </a-space>
      </p>
    </mars-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import * as Cesium from 'cesium'
let viewer: Cesium.Viewer
const cesiumContainer = ref<HTMLElement>()

const layers = {
  loadOSM() {
    const wms = new Cesium.UrlTemplateImageryProvider({
      url:
        '/api/osmlanduse/service?tiled=true&' +
        'transparent=true&format=image%2Fpng&exceptions=application%2Fvnd.ogc.se_xml&' +
        'styles=&service=WMS&version=1.3.0&request=GetMap&' +
        'layers=osmlanduse%3Aosm_lulc&crs=EPSG%3A3857&' +
        'bbox={westProjected}%2C{southProjected}%2C{eastProjected}%2C{northProjected}&' +
        'width=256&height=256'
      // rectangle: Cesium.Rectangle.fromDegrees(    // 获取某个区域的地图
      //   96.799393,
      //   -43.598214999057824,
      //   153.63925700000001,
      //   -9.2159219997013
      // )
    })
    viewer.imageryLayers.addImageryProvider(wms)
  }
}

const initCesium = async () => {
  viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement, {
    ...getDefaultConfig(),
    baseLayerPicker: false,
    geocoder : false
  })
  const customLayer = await Cesium.TileMapServiceImageryProvider.fromUrl(
    Cesium.buildModuleUrl('http://127.0.0.1:8888/assets/tiles/tiles'),{
      // minimumLevel:3,
      // maximumLevel:12
    }
  )
  // //  new Cesium.UrlTemplateImageryProvider({
  // //   url: 'http://127.0.0.1:8888/assets/tiles/tiles/{z}/{x}/{y}.png'
  // // })

  viewer.imageryLayers.addImageryProvider(customLayer)
}

onMounted(() => {
  initCesium()
})
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .cesium-container {
    width: 100%;
    height: 100%;
  }
}
</style>
