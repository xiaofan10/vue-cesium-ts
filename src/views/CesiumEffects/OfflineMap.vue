<template>
  <div class="container">
    <!-- <vc-viewer>
      <vc-layer-imagery ref="layer">
        <vc-imagery-provider-urltemplate
          :projection-transforms="projectionTransforms"
          ref="provider"
          :url="url"
        ></vc-imagery-provider-urltemplate>
      </vc-layer-imagery>
    </vc-viewer> -->
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
import * as coordtransform from '@/utils/coordtransform'

let viewer: Cesium.Viewer
const cesiumContainer = ref<HTMLElement>()
const url = ref('http://10.8.240.59:8888/assets/tiles/map1/baidu/beijing/{z}/{x}/{y}.jpg')
const projectionTransforms = ref(null)
projectionTransforms.value = {
  from: 'GCJ02',
  to: 'WGS84'
}
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
    baseLayer: false
  })

  const tilingScheme = new Cesium.WebMercatorTilingScheme()
  const projection = tilingScheme.projection
  const nativeProject = projection.project
  const nativeUnProject = projection.unproject
  let projectMethods = 'wgs84togcj02'
  let unprojectMethods = 'gcj02towgs84'
  projection.project = function (cartographic, result) {
    result = result || new Cesium.Cartesian3()
    result = coordtransform[projectMethods](
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude)
    )
    console.log(cartographic, result)
    return nativeProject.call(
      this,
      new Cesium.Cartographic(
        Cesium.Math.toRadians(result?.[0]),
        Cesium.Math.toRadians(result?.[1])
      )
    )
  }
  projection.unproject = function (cartesian2, result) {
    result = result || new Cesium.Cartographic()
    const cartographic = nativeUnProject.call(this, cartesian2)
    result = coordtransform[unprojectMethods](
      Cesium.Math.toDegrees(cartographic.longitude),
      Cesium.Math.toDegrees(cartographic.latitude)
    )
    return new Cesium.Cartographic(
      Cesium.Math.toRadians(result?.[0]),
      Cesium.Math.toRadians(result?.[1])
    )
  }

  var southwestInMeters = new Cesium.Cartesian2(-33554054, -33746824)
  var northeastInMeters = new Cesium.Cartesian2(33554054, 33746824)

  const customImageryLayer = await Cesium.TileMapServiceImageryProvider.fromUrl(
    'http://10.8.240.59:8888/assets/tiles/map/baidu/guangzhou/{z}/{x}/{y}.png',
    {
      fileExtension: 'png',
      minimumLevel: 3,
      maximumLevel: 8
    }
  )
  // customImageryLayer._tilingScheme = tilingScheme
  viewer.imageryLayers.addImageryProvider(customImageryLayer)
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
