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
import 'echarts/extension/bmap/bmap'

const areaName = []

const dpr = ref<number>(1)
const width = ref<number>(window.innerWidth)
const height = ref<number>(window.innerHeight)
const filename = ref<string>('地图')
const fontSize = ref<number>(12)
let chart: ECharts
const coords = []

const getOptions = () => ({
  bmap: {
    center: [104.114129, 37.550339],
    zoom: 5,
    roam: true,
    mapStyle: {
      styleJson: [
        {
          featureType: 'water',
          elementType: 'all',
          stylers: {
            color: '#044161'
          }
        },
        {
          featureType: 'land',
          elementType: 'all',
          stylers: {
            color: '#004981'
          }
        },
        {
          featureType: 'boundary',
          elementType: 'geometry',
          stylers: {
            color: '#064f85'
          }
        },
        {
          featureType: 'railway',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'highway',
          elementType: 'geometry',
          stylers: {
            color: '#004981'
          }
        },
        {
          featureType: 'highway',
          elementType: 'geometry.fill',
          stylers: {
            color: '#005b96',
            lightness: 1
          }
        },
        {
          featureType: 'highway',
          elementType: 'labels',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'geometry',
          stylers: {
            color: '#004981'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'geometry.fill',
          stylers: {
            color: '#00508b'
          }
        },
        {
          featureType: 'poi',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'green',
          elementType: 'all',
          stylers: {
            color: '#056197',
            visibility: 'off'
          }
        },
        {
          featureType: 'subway',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'manmade',
          elementType: 'all',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'local',
          elementType: 'all',
          stylers: {
            visibility: 'on'
          }
        },
        {
          featureType: 'arterial',
          elementType: 'labels',
          stylers: {
            visibility: 'off'
          }
        },
        {
          featureType: 'boundary',
          elementType: 'geometry.fill',
          stylers: {
            color: '#029fd4'
          }
        },
        {
          featureType: 'building',
          elementType: 'all',
          stylers: {
            color: '#1a5787'
          }
        },
        {
          featureType: 'label',
          elementType: 'all',
          stylers: {
            visibility: 'on'
          }
        }
      ]
    }
  },
  // geo: {
  //   name: 'northEastL4',
  //   type: 'map',
  //   roam: true,
  //   map: 'northEastL4',
  //   label: {
  //     show: true,
  //     fontSize: fontSize.value
  //   }
  // },
  series: [
    // {
    //   name: 'map',
    //   type: 'map',
    //   map: 'northEastL4',
    //   coordinateSystem: 'bmap',
    //   roam: true
    // },
    {
      name: 'pm2.5',
      type: 'scatter',
      coordinateSystem: 'bmap',
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
      value: [item['经度'], item['纬度'], 100, coords.length]
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
  echarts.registerMap('northEastL2', northEastL2 as any)
  chart.setOption(getOptions())
}

onMounted(() => {
  initChart()
  let map = chart.getModel().getComponent('bmap').getBMap()
  var bdary = new BMap.Boundary()
  const polygonStyle = {
    strokeWeight: 2,
    strokeColor: '#ff0000',
    fillColor: 'transparent',
    fillOpacity: 0
  }
  bdary.get('内蒙古自治区', function (rs) {
    var count = rs.boundaries.length //行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域')
      return
    }
    var pointArray = []
    for (var i = 0; i < count; i++) {
      var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
      map.addOverlay(ply) //添加覆盖物
      pointArray = pointArray.concat(ply.getPath())
    }
  })
  bdary.get('黑龙江省', function (rs) {
    var count = rs.boundaries.length //行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域')
      return
    }
    var pointArray = []
    for (var i = 0; i < count; i++) {
      var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
      map.addOverlay(ply) //添加覆盖物
      pointArray = pointArray.concat(ply.getPath())
    }
  })
  bdary.get('吉林省', function (rs) {
    var count = rs.boundaries.length //行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域')
      return
    }
    var pointArray = []
    for (var i = 0; i < count; i++) {
      var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
      map.addOverlay(ply) //添加覆盖物
      pointArray = pointArray.concat(ply.getPath())
    }
  })
  bdary.get('辽宁省', function (rs) {
    var count = rs.boundaries.length //行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域')
      return
    }
    var pointArray = []
    for (var i = 0; i < count; i++) {
      var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
      map.addOverlay(ply) //添加覆盖物
      pointArray = pointArray.concat(ply.getPath())
    }
  })
  bdary.get('呼和浩特', function (rs) {
    var count = rs.boundaries.length //行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域')
      return
    }
    var pointArray = []
    for (var i = 0; i < count; i++) {
      var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
      map.addOverlay(ply) //添加覆盖物
      pointArray = pointArray.concat(ply.getPath())
    }
  })
  bdary.get('玉泉区', function (rs) {
    var count = rs.boundaries.length //行政区域的点有多少个
    if (count === 0) {
      alert('未能获取当前输入行政区域')
      return
    }
    var pointArray = []
    for (var i = 0; i < count; i++) {
      var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
      map.addOverlay(ply) //添加覆盖物
      pointArray = pointArray.concat(ply.getPath())
    }
  })
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
<!-- 
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'
import northEastL2 from '@/assets/geo/northEastL2.json'
import 'echarts/extension/bmap/bmap'

const sheet = ref<HTMLDivElement>()
onMounted(() => {
  const chart = echarts.init(sheet.value)
  echarts.registerMap('northEast', northEastL2 as any)
  chart.setOption({
    bmap: {
      center: [104.114129, 37.550339],
      zoom: 5,
      roam: true,
      mapStyle: {
        styleJson: [
          {
            featureType: 'water',
            elementType: 'all',
            stylers: {
              color: '#044161'
            }
          },
          {
            featureType: 'land',
            elementType: 'all',
            stylers: {
              color: '#004981'
            }
          },
          {
            featureType: 'boundary',
            elementType: 'geometry',
            stylers: {
              color: '#064f85'
            }
          },
          {
            featureType: 'railway',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'highway',
            elementType: 'geometry',
            stylers: {
              color: '#004981'
            }
          },
          {
            featureType: 'highway',
            elementType: 'geometry.fill',
            stylers: {
              color: '#005b96',
              lightness: 1
            }
          },
          {
            featureType: 'highway',
            elementType: 'labels',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'geometry',
            stylers: {
              color: '#004981'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'geometry.fill',
            stylers: {
              color: '#00508b'
            }
          },
          {
            featureType: 'poi',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'green',
            elementType: 'all',
            stylers: {
              color: '#056197',
              visibility: 'off'
            }
          },
          {
            featureType: 'subway',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'manmade',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'local',
            elementType: 'all',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'arterial',
            elementType: 'labels',
            stylers: {
              visibility: 'off'
            }
          },
          {
            featureType: 'boundary',
            elementType: 'geometry.fill',
            stylers: {
              color: '#029fd4'
            }
          },
          {
            featureType: 'building',
            elementType: 'all',
            stylers: {
              color: '#1a5787'
            }
          },
          {
            featureType: 'label',
            elementType: 'all',
            stylers: {
              visibility: 'on'
            }
          }
        ]
      }
    },
    series: [
      {
        name: 'pm2.5',
        type: 'scatter',
        roam: true,
        coordinateSystem: 'bmap',
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
</script> -->
