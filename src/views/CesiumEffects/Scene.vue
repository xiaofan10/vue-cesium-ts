<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="0" top="100" bottom="10" width="300" title="Scene">
      <p>
        <a-space> heading-左右摇头 </a-space>
      </p>
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import { getDefaultConfig } from '@/utils/cesiumUtils'
let viewer: Cesium.Viewer
const cesiumContainer = ref<HTMLElement | null>(null)

const initCesium = () => {
  viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement, getDefaultConfig())
  viewer.scene.debugShowFramesPerSecond = true
  viewer.scene.debugShowCommands = false
  viewer.scene.debugShowFrustumPlanes = true
  viewer.scene.debugShowDepthFrustum = 1
  viewer.scene.globe.enableLighting = true
  viewer.scene.mode = Cesium.SceneMode.SCENE3D
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
