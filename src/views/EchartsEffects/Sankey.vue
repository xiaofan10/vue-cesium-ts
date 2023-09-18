<template>
  <div class="sheet" ref="sheet"></div>
  <div class="tool">
    <a-space>
      起始点
      <mars-input v-model:value="start" />
    </a-space>

    <a-space>
      终点
      <mars-input v-model:value="end" />
    </a-space>
    <mars-button @click="onSearch">搜索</mars-button>
    <mars-button @click="downloadImage">导出图片</mars-button>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
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
const onSearch = () => {
  console.log(chart)
  window.chart = chart
  let dataIndexInside
  links.forEach((item, i) => {
    if (item.source === start.value && item.target === end.value) {
      console.log(i)
      dataIndexInside = i
    }
  })
  // if (dataIndexInside !== undefined) {
  chart.dispatchAction({
    type: 'select',
    seriesIndex: 0,
    dataType: 'edge',
    // dataIndex: dataIndexInside,
    // name: '中粮集团有限公司 > 中谷粮油集团有限公司',
    name: start.value + ' > ' + end.value
  })
  // }
}

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

const custom = {
  symbol: 'rect', // 使用矩形节点
  symbolSize: [60, 30], // 设置节点大小
  label: {
    show: true,
    position: 'inside'
  },
  itemStyle: {
    normal: {
      color: 'blue',
      borderRadius: 10 // 设置圆角
    },
    emphasis: {
      color: 'red'
    }
  }
}

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
    color: ['#4995f5'],
    series: [
      {
        type: 'sankey',
        data: nodes,
        links: links,
        nodeWidth: 50,
        nodeGap: 8,
        layoutIterations: 64,
        // nodeAlign: 'right',
        itemStyle: {
          borderJoin: 'round',
          borderCap: 'round'
        },
        edgeLabel: {
          show: true,
          color: '#333',
          formatter: '{c}%'
        },
        lineStyle: {
          color: 'gradient',
          // color: 'source',
          curveness: 0.5,
          opacity: 0.5
        },
        emphasis: {
          focus: 'adjacency'
        },
        selectedMode: 'single',
        select: {
          lineStyle: {
            color: '#0ee9e5',
            opacity: 1
          }
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #170747;
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
