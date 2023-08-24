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
import northEastL3 from '@/assets/geo/northEastL3.json'
import northEastL2 from '@/assets/geo/northEastL2.json'
import geoCoord from '@/assets/geo/dd.json'
import yangzhi from '@/assets/images/yangzhi.png'
import dadou from '@/assets/images/dadou.png'
import siliao from '@/assets/images/siliao.png'
import dami from '@/assets/images/dami.png'
import xiaomai from '@/assets/images/xiaomai.png'
import yumi from '@/assets/images/yumi.png'
console.log(yangzhi)

const dpr = ref<number>(1)
const width = ref<number>(window.innerWidth)
const height = ref<number>(window.innerHeight)
const filename = ref<string>('地图')
const fontSize = ref<number>(12)
let chart: ECharts
const coords = []

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
  '古塔区',
  '细河区',
  '太平区',
  '海州区',
  '新邱区',
  '沙河口区',
  '西岗区',
  '中山区',
  '站前区',
  '老边区',
  '西市区',
  '元宝区',
  '清河区',
  '银州区',
  '前进区',
  '尖山区',
  '四方台区',
  '建华区',
  '龙沙区',
  '昂昂溪区',
  '铁锋区',
  '龙凤区',
  '让胡路区',
  '旅顺口区',
  '新抚区',
  '望花区',
  '顺城区',
  '平房区',
  '南岗区',
  '鄂伦春自治旗',
  '泰来县',
  '乾安县',
  '南关区',
  '龙潭区',
  '二道江区',
  '平山区',
  '鲅鱼圈区',
  '龙城区',
  '红山区',
  '岭东区',
  '鸡东县',
  '郊区',
  '兴安区',
  '东风区',
  '永吉县',
  '翁牛特旗'
]
const seriesOpt = {
  name: 'pos',
  type: 'scatter',
  coordinateSystem: 'geo',
  encode: {
    value: 2
  },
  symbolSize: 40,
  label: {
    show: true,
    formatter: '{@[3]}',
    color: '#000',
    offset: [0, 2],
    fontSize: 20
  },
  itemStyle: {
    color: '#29b8e1'
  },
  z: 4,
  emphasis: {
    label: {
      show: true
    }
  }
}
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
        return !includes.includes(name) ? name : ''
      }
    },
    itemStyle: {
      areaColor: 'transparent'
    },
    z: 3
  },
  series: [
    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 1),
      symbol: 'circle',
      label: {
        show: true,
        formatter: '{@[3]}',
        fontSize: 20
      }
    },

    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 7),
      symbol: `image://http://${location.host}${yangzhi}`
      // label: {
      //   show: true,
      //   formatter: '{@[3]}',
      //   color: '#fff',
      //   offset: [0, 2],
      //   fontSize: 20
      // }
    },
    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 6),
      symbol: `image://http://${location.host}${siliao}`
    },
    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 5),
      symbol: `image://http://${location.host}${yumi}`
    },
    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 4),
      symbol: `image://http://${location.host}${dami}`
    },
    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 3),
      symbol: `image://http://${location.host}${xiaomai}`
    },
    {
      ...seriesOpt,
      data: coords.filter((item) => item.type == 2),
      symbol: `image://http://${location.host}${dadou}`
    },

    {
      name: '底图',
      type: 'map',
      map: 'northEastL2',
      roam: true,
      data: [],
      z: 1,
      label: {
        show: true,
        fontSize: fontSize.value,
        fontWeight: 'bold'
      },
      itemStyle: {
        // areaColor: 'transparent',
        borderColor: '#393939',
        borderWidth: 3
      }
    },
    {
      name: '底图',
      type: 'map',
      map: 'northEastL3',
      roam: true,
      z: 2,
      data: [],
      label: {
        show: true,
        fontWeight: 'bold',
        fontSize: fontSize.value
      },
      itemStyle: {
        areaColor: 'transparent',
        borderColor: '#767676',
        borderWidth: 2
      }
    }
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
      type: item['类型'],
      value: [item['经度'], item['纬度'], 100, item['序号']]
    })
  })
})

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
  echarts.registerMap('northEastL3', northEastL3 as any)
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
