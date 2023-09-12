<template>
  <div class="sheet" ref="sheet" :style="sheetStyleCom"></div>
  <div class="tool">
    <a-space>
      长度
      <mars-input v-model:value="width" type="number" />
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
import sankeyJson from '@/assets/geo/sankey.json'

const dpr = ref<number>(1)
const width = ref<number>(window.innerWidth)
const height = ref<number>(window.innerHeight)
const filename = ref<string>('地图')
const fontSize = ref<number>(12)

const sheetStyleCom = computed(() => {
  const x = dpr.value || 1
  const w = width.value * x
  const h = height.value * x
  const l = w > window.innerWidth ? (w - window.innerWidth) / 2 : -100
  const t = h > window.innerHeight ? (h - window.innerHeight) / 2 : 0
  return {
    left: -l + 'px',
    top: -t + 'px',
    width: w + 'px',
    height: h + 'px'
  }
})
const sheet = ref<HTMLDivElement>()
let chart: ECharts

const getNodes = (data) => {
  const nodesObj = {}
  function normalizeNodes(data) {
    data.forEach((item) => {
      if (!nodesObj[item.name]) {
        nodesObj[item.name] = {
          name: item.name
        }
      }
      if (item.children) {
        normalizeNodes(item.children)
      }
    })
  }
  normalizeNodes(data)
  return Object.values(nodesObj)
}

const getLinks = (data) => {
  const links: any[] = []
  function normalizeLinks(data, source) {
    data.forEach((item) => {
      links.push({
        source: source.name,
        target: item.name,
        value: item.value
      })
      if (item.children) {
        normalizeLinks(item.children, item)
      }
    })
  }
  data.forEach((item) => {
    if (item.children) {
      normalizeLinks(item.children, item)
    }
  })
  return links
}

const nodes = sankeyJson.nodes
const links = sankeyJson.links
console.log(nodes, links)

const initChart = () => {
  chart = echarts.init(sheet.value)
  chart.setOption({
    series: [
      {
        type: 'sankey',
        data: nodes,
        links: links,
        edgeLabel: {
          show: true,
          formatter: '{c}%'
        }
      }
    ]
  })
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
  initChart()
})
</script>

<style lang="less" scoped>
.sheet {
  position: fixed;
  top: 0%;
  left: 100px;
  width: 200%;
  height: 200%;
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
