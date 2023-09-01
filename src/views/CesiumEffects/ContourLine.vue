<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="10" top="10" bottom="10" width="300" title="等高线">
      <mars-button type="dashed" ghost @click="handler.addTerrain">添加地形</mars-button>
      <mars-button type="dashed" ghost @click="handler.addElevationContour">添加等高线</mars-button>
      <mars-button type="dashed" ghost @click="handler.addElevationRamp">添加晕渲图</mars-button>
      <mars-button type="dashed" ghost @click="handler.addElevationBand"
        >添加等高区间图</mars-button
      >
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import { Math3d } from '@/lib/cesium/math/math'

let viewer
let math3d
const cesiumContainer = ref<any>(null)
// 加载地形
async function createWorldTerrain(viewer, { requestWaterMask, requestVertexNormals }) {
  const terrain = await Cesium.createWorldTerrainAsync({
    requestWaterMask: requestWaterMask,
    requestVertexNormals: requestVertexNormals
  })
  viewer.terrainProvider = terrain
}

async function createElevationBand(viewer) {
  const elevationBandMaterial = Cesium.createElevationBandMaterial({
    scene: viewer.scene,
    layers: [
      {
        entries: [
          {
            height: 800,
            color: Cesium.Color.RED
          },
          {
            height: 2000,
            color: Cesium.Color.GREEN
          }
        ]
      },
      {
        entries: [
          {
            height: 3000,
            color: Cesium.Color.YELLOW
          },
          {
            height: 5000,
            color: Cesium.Color.BLUE
          }
        ]
      }
    ]
  })
  viewer.scene.globe.material = elevationBandMaterial
}

async function createElevationRamp(
  viewer,
  options?: {
    image?: string
    min?: number
    max?: number
  }
) {
  const { image, min, max } = options || {}
  const elevationBandMaterial = new Cesium.Material({
    fabric: {
      type: 'ElevationRamp',
      uniforms: {
        image: image || '/assets/images/texture/color1.png',
        minimumHeight: min || 0,
        maximumHeight: max || 5000
      }
    }
  })
  viewer.scene.globe.material = elevationBandMaterial
}

async function createElevationContour(
  viewer,
  options?: {
    color?: Cesium.Color
    spacing?: number
    width?: number
  }
) {
  const { color, spacing, width } = options || {}
  const elevationBandMaterial = new Cesium.Material({
    fabric: {
      type: 'ElevationContour',
      uniforms: {
        color: color || Cesium.Color.RED.withAlpha(0.5),
        spacing: spacing || 50,
        width: width || 5
      }
    }
  })
  viewer.scene.globe.material = elevationBandMaterial
}

function initCesium() {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    ...getDefaultConfig()
  })

  viewer.clock.shouldAnimate = true
  math3d = new Math3d(viewer, Cesium)
}

const handler = {
  addElevationContour() {
    createElevationContour(viewer)
  },
  addElevationRamp() {
    createElevationRamp(viewer)
  },
  addTerrain() {
    createWorldTerrain(viewer, { requestWaterMask: true, requestVertexNormals: true })
  },
  addElevationBand() {
    createElevationBand(viewer)
  }
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
