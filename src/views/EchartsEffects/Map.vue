<template>
  <div class="sheet" ref="sheet" :style="sheetStyleCom"></div>
  <div class="tool">
    <a-space>
      长度
      <mars-input v-model:value="width" @change="handleChange" type="number" />
    </a-space>
    <a-space>
      宽度
      <mars-input v-model:value="height" @change="handleChange" type="number" />
    </a-space>
    <a-space>
      文件名称
      <mars-input v-model:value="filename" />
    </a-space>
    <mars-button @click="downloadImage">导出图片</mars-button>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { computed, onMounted, ref } from 'vue'
import northEastL3 from '@/assets/geo/northEastL3.json'
import northEastL2 from '@/assets/geo/northEastL2.json'
const width = ref<number>(window.innerWidth)
const height = ref<number>(window.innerHeight)
const filename = ref<string>('地图')
let chart: ECharts
const sheetStyleCom = computed(() => {
  return {
    width: width.value + 'px',
    height: height.value + 'px'
  }
})

const handleChange = () => {
  chart.resize({ width: width.value, height: height.value })
}

const sheet = ref<HTMLDivElement>()
const areaColor = {
  210000: '#f00',
  150000: '#0f0',
  230000: '#ff0',
  220000: '#0ff'
}

const downloadImage = () => {
  const base64Data = chart.getDataURL()
  const a = document.createElement('a')
  a.href = base64Data
  a.download = filename.value
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

onMounted(() => {
  chart = echarts.init(sheet.value)
  echarts.registerMap('northEastL3', northEastL3 as any)
  echarts.registerMap('northEastL2', northEastL2 as any)
  chart.setOption({
    series: [
      {
        name: 'northEastL3',
        type: 'map',
        roam: true,
        map: 'northEastL3',
        label: {
          show: true
        },
        zoom: 1.2,
        data: northEastL3.features.map(function (feature) {
          console.log(feature.properties)
          return {
            name: feature.properties.name,
            value: 100, // value 可以是任意数字，影响颜色的渐变
            itemStyle: {
              areaColor: areaColor[feature.properties.parent.adcode] || '#00f' // 从 GeoJSON 属性获取颜色值
            }
          }
        })
      }
    ]
  })
})
</script>

<style lang="less" scoped>
.sheet {
  position: fixed;
  // top: 0;
  // left: 0;
  // bottom: 0;
  // right: 0;
  z-index: 999999;
  width: 200%;
  height: 200%;
}
.tool {
  position: absolute;
  z-index: 10000000;
  right: 0;
  top: 0;
  background: rgba(23, 49, 71, 0.8);
}
</style>
