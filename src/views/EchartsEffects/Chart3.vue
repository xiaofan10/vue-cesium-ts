<template>
  <div class="sheet" ref="sheet"></div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import sankeyJson from '@/assets/geo/sankey.json'

const dpr = ref<number>(1)
const start = ref<string>('中粮集团有限公司')
const end = ref<string>('中粮集团(香港)有限公司')
const filename = ref<string>('地图')

const sheet = ref<HTMLDivElement>()
let chart: ECharts

const nodes = sankeyJson.nodes
const links = sankeyJson.links

const initChart = () => {
  chart = echarts.init(sheet.value)
  chart.setOption({
    tooltip: {
      show: true,
      formatter(params) {
        if (params.dataType === 'node') return
        return params.name + ': ' + params.value + '%'
      }
    },
    color: ['#A0D4FA', '#63A6F5', '#3561AF', '#182F74'],
    series: [
      {
        type: 'sankey',
        data: nodes,
        links: links,
        edgeLabel: {
          show: true,
          formatter: '{c}%'
        },
        lineStyle: {
          color: 'source',
          curveness: 0.5
        },
        emphasis: {
          focus: 'adjacency'
        },
        selectedMode: 'single',
        select: {
          lineStyle: {
            color: '#f00',
            opacity: 1
          }
        }
      }
    ]
  })
}

onMounted(() => {
  initChart()
})
</script>

<style lang="less" scoped>
.sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
}
.tool {
  display: true;
  position: absolute;
  z-index: 100000000;
  right: 0;
  top: 0;
  background: rgba(23, 49, 71, 0.8);
}
</style>
