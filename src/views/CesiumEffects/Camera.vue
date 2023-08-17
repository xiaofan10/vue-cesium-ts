<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" left="100" top="10" bottom="10" width="300" title="UI组件展示">
      <a-space>
        材料特效
        <mars-select
          ref="select"
          v-model:value="materialTypeValue"
          :options="materialOptions"
          style="width: 120px"
          @change="onMaterialChange"
        >
        </mars-select>
      </a-space>
      <p>
        <a-space>
          heading-左右摇头
          <mars-input v-model:value="heading" @change="headingChange" type="number" />
        </a-space>
      </p>
      <p>
        <a-space>
          pitch-抬头点头
          <mars-input v-model:value="pitch" @change="pitchChange" type="number" />
        </a-space>
      </p>
      <p>
        <a-space>
          roll-翻转
          <mars-input v-model:value="roll" @change="rollChange" type="number" step="0.1" />
        </a-space>
      </p>
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import { Math3d } from '@/lib/cesium/math/math'
import * as Cesium from 'cesium'
import { createMaterialProperty } from '@/lib/cesium/helper/index'
import { Color } from 'cesium'

let viewer: Cesium.Viewer
let math3d
const cesiumContainer = ref<any>(null)
const materialTypeValue = ref<string>('')
const materialOptions = reactive([
  {
    value: '',
    label: '请选择特效'
  },
  {
    value: 'RadarLine',
    label: '简单雷达'
  }
])

const heading = ref(0)
const pitch = ref(0)
const roll = ref(0)
const headingChange = (e) => {
  const val = e.target.value || 0
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000),
    orientation: {
      heading: Cesium.Math.toRadians(Number(val)),
      pitch: Cesium.Math.toRadians(Number(pitch.value)),
      roll: Number(roll.value)
    }
  })
}
const pitchChange = (e) => {
  const val = e.target.value || 0
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000),
    orientation: {
      heading: Cesium.Math.toRadians(Number(heading.value)),
      pitch: Cesium.Math.toRadians(Number(val)),
      roll: Number(roll.value)
    }
  })
}
const rollChange = (e) => {
  const val = e.target.value || 0
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000),
    orientation: {
      heading: Cesium.Math.toRadians(Number(heading.value)),
      pitch: Cesium.Math.toRadians(Number(pitch.value)),
      roll: Number(val)
    }
  })
}

const dialogVisible = ref<Boolean>(false)

const handleDialog = () => {
  dialogVisible.value = !dialogVisible.value
}

const removeEntities = () => {
  viewer.entities.removeAll()
}
const setRadarLine = () => {
  const ellipse = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      height: 1000,
      // @ts-ignore
      material: createMaterialProperty('RadarLine', {
        color: Cesium.Color.GREEN,
        speed: 20
      })
    }
  })
  viewer.zoomTo(ellipse)
}

const onMaterialChange = (val) => {
  console.log(val)
  removeEntities()
  switch (val) {
    case 'RadarLine':
      setRadarLine()
      break

    default:
  }
}

function initCesium() {
  // Cesium.Ion.defaultAccessToken =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2UyZDI3NS02M2NjLTQ1OTUtODBmMC03YWNhYzk1NzU2M2MiLCJpZCI6MTU2MDQyLCJpYXQiOjE2OTAyMDc4ODR9.BmN3pOpnSPgJa2eBzYBHt5xrnMaIlV7MdcNrvowXpfs'
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    ...getDefaultConfig()
  })
  viewer.clock.shouldAnimate = true
  math3d = new Math3d(viewer, Cesium)

  console.log(viewer.camera)
  // viewer.camera.flyTo({
  //   destination: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061, 10000)
  // })
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(0, 0, 10000),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(heading.value),
  //     pitch: Cesium.Math.toRadians(pitch.value),
  //     roll: Number(roll.value)
  //   }
  // })

  // var osmLandUseUrl = 'https://osmlanduse.org/{z}/{x}/{y}.png' // 示例 URL 模板

  // var osmLandUseImageryProvider = new Cesium.UrlTemplateImageryProvider({
  //   url: osmLandUseUrl
  // })

  // viewer.imageryLayers.addImageryProvider(osmLandUseImageryProvider)

  // const osmImageryProvider = new Cesium.OpenStreetMapImageryProvider({
  //   url: 'https://a.tile.openstreetmap.org/' // OSM 地图服务的 URL
  // })

  // // 将 OSM 图层添加到 Viewer
  // viewer.imageryLayers.addImageryProvider(osmImageryProvider)
  // https://maps.heigit.org/osmlanduse/service
  var wmsOptions = {
    url: '/api/osmlanduse/service', // 示例 WMS 服务 URL
    layers: 'osmlanduse:osm_lulc', // 示例图层名称
    parameters: {
      format: 'image/png',
      transparent: true,
      // srs: 'EPSG:3857',
      crs: 'EPSG:3857',
      // VERSION: '1.3.0'
      version: '1.3.0'
    }
  }

  var wmsImageryProvider = new Cesium.WebMapServiceImageryProvider(wmsOptions)

  viewer.imageryLayers.addImageryProvider(wmsImageryProvider)
  createAxis()
}

const createAxis = () => {
  // 经度、纬度、高度
  var centerLongitude = 0
  var centerLatitude = 0
  var centerHeight = 0.0

  // 创建坐标轴线段
  function createAxisLine(start, end, color) {
    viewer.entities.add({
      polyline: {
        positions: [start, end],
        width: 100,
        material: new Cesium.PolylineArrowMaterialProperty(color)
      }
    })
  }

  // 将经度、纬度、高度转换为 Cartesian3 坐标
  var centerPosition = Cesium.Cartesian3.fromDegrees(centerLongitude, centerLatitude, centerHeight)

  // X 轴
  var xAxisEnd = new Cesium.Cartesian3(
    centerPosition.x + 1000000,
    centerPosition.y,
    centerPosition.z
  )
  createAxisLine(centerPosition, xAxisEnd, Cesium.Color.RED)

  // Y 轴
  var yAxisEnd = new Cesium.Cartesian3(
    centerPosition.x,
    centerPosition.y + 1000000,
    centerPosition.z
  )
  createAxisLine(centerPosition, yAxisEnd, Cesium.Color.GREEN)

  // Z 轴
  var zAxisEnd = new Cesium.Cartesian3(
    centerPosition.x,
    centerPosition.y,
    centerPosition.z + 1000000
  )
  createAxisLine(centerPosition, zAxisEnd, Cesium.Color.BLUE)

  // // // 将相机定位到球心位置
  // viewer.camera.flyTo({
  //   destination: centerPosition,
  //   duration: 2
  // })
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
