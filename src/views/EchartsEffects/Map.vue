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
      倍数
      <mars-input v-model:value="dpr" @change="handleChange" type="number" />
    </a-space>
    <a-space>
      字号
      <mars-input v-model:value="fontSize" @change="handleChange" type="number" />
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
import northEastL4 from '@/assets/geo/northEastL4.json'
import northEastL2 from '@/assets/geo/northEastL2.json'
import geoCoord from '@/assets/geo/dd.json'

const dpr = ref<number>(1)
const width = ref<number>(window.innerWidth)
const height = ref<number>(window.innerHeight)
const filename = ref<string>('地图')
const fontSize = ref<number>(12)
let chart: ECharts
const coords = []

const getOptions = () => ({
  geo: {
    name: 'northEastL4',
    type: 'map',
    roam: true,
    map: 'northEastL4',
    label: {
      show: true,
      fontSize: fontSize.value,
      formatter({ name }) {
        const includes: string[] = [
          '兴山区',
          '向阳区',
          '工农区',
          '南山区',
          '麻山区',
          '滴道区',
          '麻山区',
          '恒山区',
          '梨树区',
          '城子河区',
          '回民区',
          '玉泉区',
          '赛罕区',
          '皇姑区',
          '大东区',
          '沈河区',
          '和平区',
          '浑南区',
          '西安区',
          '龙山区',
          '太子河区',
          '文圣区',
          '白塔区',
          '弓长岭区',
          '宏伟区',
          '立山区',
          '铁东区',
          '铁西区',
          '双台子区',
          '兴隆台区',
          '凌河区',
          '古塔区'
        ]
        return !includes.includes(name) ? name : ''
      }
    }
  },
  series: [
    {
      name: 'pm2.5',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: coords,
      encode: {
        value: 2
      },

      symbolSize: 20,
      label: {
        show: true,
        formatter: '{@[3]}'
      },

      itemStyle: {
        color: '#29b8e1'
      },
      emphasis: {
        label: {
          show: true
        }
      }
    }
    // {
    //   name: '底图',
    //   type: 'map',
    //   map: 'northEastL2',
    //   roam: false,
    //   data: [],
    //   itemStyle: {
    //     areaColor: 'transparent',
    //     borderColor: '#393939',
    //     borderWidth: 2
    //   }
    // }
  ]
})

const sheetStyleCom = computed(() => {
  const x = dpr.value || 1
  const w = width.value * x
  const h = height.value * x
  const l = w > window.innerWidth ? (w - window.innerWidth) / 2 : 0
  const t = h > window.innerHeight ? (h - window.innerHeight) / 2 : 0
  return {
    left: -l + 'px',
    top: -t + 'px',
    width: w + 'px',
    height: h + 'px'
  }
})

Object.values(geoCoord).forEach((child) => {
  child.forEach((item) => {
    coords.push({
      name: item['单位名称'],
      value: [item['经度'], item['纬度'], 100, item['序号']]
    })
  })
})
console.log(coords)

const handleChange = () => {
  const x = dpr.value || 1
  chart.setOption(getOptions())
  chart.resize({ width: width.value * x, height: height.value * x })
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

const initChart = () => {
  chart = echarts.init(sheet.value)
  echarts.registerMap('northEastL4', northEastL4 as any)
  echarts.registerMap('northEastL2', northEastL2 as any)
  chart.setOption(getOptions())
}

onMounted(() => {
  initChart()
})
// 5760 3240
</script>

<style lang="less" scoped>
.sheet {
  position: fixed;
  top: 0%;
  left: 0%;
  z-index: 9999999;
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
