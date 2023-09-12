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
const defaultPalette = [
  // '#51689b', '#ce5c5c', '#fbc357', '#8fbf8f', '#659d84', '#fb8e6a', '#c77288', '#786090', '#91c4c5', '#6890ba'
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc'
]
const data = [
  { value: 800, name: 'A' },
  { value: 635, name: 'B' },
  { value: 580, name: 'C' },
  { value: 484, name: 'D' },
  { value: 300, name: 'E' },
  { value: 200, name: 'F' }
]

const radius = ['30%', '80%']

const parliamentOption = (function () {
  let sum = data.reduce(function (sum, cur) {
    return sum + cur.value
  }, 0)
  let angles = []
  let startAngle = -Math.PI / 2
  let curAngle = startAngle
  data.forEach(function (item) {
    angles.push(curAngle)
    curAngle += (item.value / sum) * Math.PI * 2
  })
  angles.push(startAngle + Math.PI * 2)
  function parliamentLayout(startAngle, endAngle, totalAngle, r0, r1, size) {
    let rowsCount = Math.ceil((r1 - r0) / size)
    let points = []
    let r = r0
    for (let i = 0; i < rowsCount; i++) {
      // Recalculate size
      let totalRingSeatsNumber = Math.round((totalAngle * r) / size)
      let newSize = (totalAngle * r) / totalRingSeatsNumber
      for (
        let k = Math.floor((startAngle * r) / newSize) * newSize;
        k < Math.floor((endAngle * r) / newSize) * newSize - 1e-6;
        k += newSize
      ) {
        let angle = k / r
        let x = Math.cos(angle) * r
        let y = Math.sin(angle) * r
        points.push([x, y])
      }
      r += size
    }
    return points
  }
  return {
    series: {
      type: 'custom',
      id: 'distribution',
      data: data,
      coordinateSystem: undefined,
      universalTransition: true,
      animationDurationUpdate: 1000,
      renderItem: function (params, api) {
        var idx = params.dataIndex
        var viewSize = Math.min(api.getWidth(), api.getHeight())
        var r0 = ((parseFloat(radius[0]) / 100) * viewSize) / 2
        var r1 = ((parseFloat(radius[1]) / 100) * viewSize) / 2
        var cx = api.getWidth() * 0.5
        var cy = api.getHeight() * 0.5
        var size = viewSize / 50
        var points = parliamentLayout(angles[idx], angles[idx + 1], Math.PI * 2, r0, r1, size + 3)
        return {
          type: 'group',
          children: points.map(function (pt) {
            return {
              type: 'circle',
              autoBatch: true,
              shape: {
                cx: cx + pt[0],
                cy: cy + pt[1],
                r: size / 2
              },
              style: {
                fill: defaultPalette[idx % defaultPalette.length]
              }
            }
          })
        }
      }
    }
  }
})()

var MyShape = echarts.graphic.extendShape({
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function (ctx, shape) {
    console.log(1111, shape)
    ctx.moveTo(shape.x, shape.y)
    ctx.lineTo(shape.x + shape.width, shape.y)
    ctx.lineTo(shape.x, shape.y + shape.height)
    ctx.lineTo(shape.x + shape.width, shape.y + shape.height)
    ctx.closePath()
  }
})
echarts.graphic.registerShape('myCustomShape', MyShape)

const initChart = () => {
  chart = echarts.init(sheet.value)
  chart.setOption({
    series: {
      type: 'custom',
      coordinateSystem: 'none',
      renderItem: function (params, api) {
        console.log(params, api, api.getHeight(), api.getWidth())
        return {
          type: 'group',
          children: [
            {
              type: 'rect',
              position: [api.value(2), api.value(3)],
              shape: {
                width: api.value(0),
                height: api.value(1)
              },
              style: {
                fill: 'red',
                text: '哈哈哈哈'
              }
            }
          ]
        }
      },
      data: [[200, 200, 30, 40]]
    }
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
