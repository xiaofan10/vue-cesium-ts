<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="10" top="10" bottom="10" width="300" title="UI组件展示">
      <a-space>
        Select
        <mars-select
          ref="select"
          v-model:value="materialTypeValue"
          :options="materialOptions"
          style="width: 120px"
        >
        </mars-select>
      </a-space>
      <br />
      <br />
      <a-space>
        <mars-button size="small" @click="handleDialog">dialog</mars-button>
      </a-space>
      <br />
      <br />
      <mars-input placeholder="input"></mars-input>
    </mars-dialog>

    <mars-dialog :visible="dialogVisible" right="10" width="300" title="dialog"> </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import * as Cesium from 'cesium'
let viewer: Cesium.Viewer

const cesiumContainer = ref<any>(null)
const materialTypeValue = ref<string>('')
const materialOptions = reactive([
  {
    value: '',
    label: '无'
  },
  {
    value: 'gps',
    label: '美国GPS系统'
  }
])

const dialogVisible = ref<Boolean>(false)

const handleDialog = () => {
  dialogVisible.value = !dialogVisible.value
  const ellipse = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      height: 1000,
      // @ts-ignore
      material: new Cesium.Scene.RadarLineMaterialProperty({
        color: Cesium.Color.GREEN,
        speed: 20
      })
    }
  })
  viewer.zoomTo(ellipse)
  console.log(ellipse)
}

function initCesium() {
  // Cesium.Ion.defaultAccessToken =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2UyZDI3NS02M2NjLTQ1OTUtODBmMC03YWNhYzk1NzU2M2MiLCJpZCI6MTU2MDQyLCJpYXQiOjE2OTAyMDc4ODR9.BmN3pOpnSPgJa2eBzYBHt5xrnMaIlV7MdcNrvowXpfs'
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    ...getDefaultConfig()
  })
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
