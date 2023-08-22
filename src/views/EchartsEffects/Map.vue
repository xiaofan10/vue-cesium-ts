<template>
  <div class="sheet" ref="sheet"></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import northEastGeoJson from '@/assets/geo/northEastGeo.json'
const sheet = ref<HTMLDivElement>()
onMounted(() => {
  const chart = echarts.init(sheet.value)
  echarts.registerMap('northEast', northEastGeoJson as any)
  chart.setOption({
    series: [
      {
        name: 'northEast',
        type: 'map',
        roam: true,
        map: 'northEast',
        emphasis: {
          label: {
            show: true
          }
        },
        data: []
      }
    ]
  })
})
</script>

<style lang="less" scoped>
.sheet {
  width: 100%;
  height: 100%;
}
</style>
