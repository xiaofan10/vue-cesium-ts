<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'

const materialTypeValue = ref('')
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
const cesiumContainer = ref<any>(null)

const Cesium: any = inject('Cesium')
let viewer
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

<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" left="10" top="10" bottom="10" width="300" title="学习示例">
      <a-space>
        Space
        <mars-select
          ref="select"
          v-model:value="materialTypeValue"
          :options="materialOptions"
          style="width: 120px"
        >
        </mars-select>
      </a-space>
    </mars-dialog>
  </div>
</template>

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
