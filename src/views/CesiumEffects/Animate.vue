<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="10" top="10" bottom="10" width="300" title="等高线">
      <mars-button type="dashed" ghost @click="handler.addBox">创建正方体</mars-button>
      <mars-button type="dashed" ghost @click="handler.addRunBox"
        >使用CallbackProperty运动正方体</mars-button
      >
      <mars-button type="dashed" ghost @click="handler.addSampledRunBox"
        >使用SampledPositionProperty运动正方体</mars-button
      >
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'

let viewer
const cesiumContainer = ref<any>(null)

function initCesium() {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    ...getDefaultConfig()
  })

  viewer.clock.shouldAnimate = true
}

const createBoxEntity = (
  viewer,
  options?: {
    position?: Cesium.Cartesian3
    x?: number
    y?: number
    z?: number
  }
) => {
  const { x, y, z, position } = options || {}
  const entity = viewer.entities.add({
    name: 'box',
    position: position || Cesium.Cartesian3.fromDegrees(-107.0, 40.0, 300000.0),
    box: {
      dimensions: new Cesium.Cartesian3(x || 400000.0, y || 300000.0, z || 500000.0)
    }
  })
  return entity
}

const createRunBox = (viewer) => {
  const lon = -107.0
  const lat = 40.0
  const height = 300000.0
  const step = 0.1
  let num = 1
  const position = Cesium.Cartesian3.fromDegrees(lon, lat, height)
  const entity = createBoxEntity(viewer, { position })

  entity.position = new Cesium.CallbackProperty(function (time, result) {
    const l = lon + num * step
    num++
    const cartesian3 = Cesium.Cartesian3.fromDegrees(l, lat, height)
    viewer.trackedEntity = null
    viewer.trackedEntity = entity
    return cartesian3
  }, false)
}

const createRunSampledBox = (viewer) => {
  const lon = -107.0
  const lat = 40.0
  const height = 300000.0
  const duration = 1
  const startTime = Cesium.JulianDate.now()
  const endTime = Cesium.JulianDate.addSeconds(startTime, duration, new Cesium.JulianDate())

  viewer.clock.startTime = startTime.clone()
  viewer.clock.currentTime = startTime.clone()
  viewer.clock.stopTime = endTime.clone()
  viewer.clock.clockRange = Cesium.ClockRange.CLAMPED // 运动到终点，并保持在终点位置不动
  viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER

  const position = Cesium.Cartesian3.fromDegrees(lon, lat, height)
  const entity = createBoxEntity(viewer, { position })
  entity.position = new Cesium.SampledPositionProperty()
  entity.position.addSample(startTime, Cesium.Cartesian3.fromDegrees(lon, lat, height))
  entity.position.addSample(endTime, Cesium.Cartesian3.fromDegrees(-100, lat, height))
  viewer.trackedEntity = entity

//   viewer.screenSpaceEventHandler.setInputAction(function (event) {
//     const point = viewer.scene.pickPosition(event.position)
//     if (point) {
//       const end = Cesium.JulianDate.addSeconds(
//         viewer.clock.stopTime,
//         duration,
//         new Cesium.JulianDate()
//       )
//       viewer.clock.stopTime = end.clone()
//       entity.position.addSample(end, point)
//       viewer.trackedEntity = null
//     viewer.trackedEntity = entity
//     }
//   }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

const handler = {
  addBox() {
    createBoxEntity(viewer)
  },
  addRunBox() {
    createRunBox(viewer)
  },
  addSampledRunBox() {
    createRunSampledBox(viewer)
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
