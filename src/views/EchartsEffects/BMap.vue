<template>
  <div class="sheet" ref="sheet"></div>
  <div class="map-result" ref="mapResult"></div>
  <div class="tool">
    <mars-table :columns="columns" :data-source="mockList" :scroll="{ y: 240 }">
      <!-- <template #action>
        <a>action</a>
      </template> -->
    </mars-table>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { computed, onMounted, ref } from 'vue'
import mockList from '@/assets/mock/companys.js'
import northEastL4 from '@/assets/geo/northEastL4.json'
import northEastL2 from '@/assets/geo/northEastL2.json'
import chinaJson from '@/assets/geo/china.json'
import geoCoord from '@/assets/geo/dd.json'
import 'echarts/extension/bmap/bmap'
import axios from 'axios'
const columns = [
  { title: '公司名称', width: 100, dataIndex: 'group', key: 'group', fixed: 'left' },
  { title: '单位名称', width: 100, dataIndex: 'company', key: 'company', fixed: 'left' },
  { title: '归属地', width: 100, dataIndex: 'province', key: 'province', fixed: 'left' },
  { title: '经度', width: 100, dataIndex: 'lon', key: 'lon', fixed: 'left' },
  { title: '纬度', width: 100, dataIndex: 'lat', key: 'lat', fixed: 'left' },
  { title: '仓储类型', dataIndex: 'type', key: 'type' }
  // {
  //   title: 'Action',
  //   key: 'operation',
  //   fixed: 'right',
  //   width: 100,
  //   slots: { customRender: 'action' }
  // }
]

const areaName = []

class Map {}

const dpr = ref<number>(1)
const mapResult = ref<HTMLDivElement>()
let chart: ECharts
let bMap
const coords = []

const addScatterLayer = (dataSource) => {
  const data = dataSource.map((item) => {
    return {
      group: item.group,
      name: item.company,
      value: [Number(item.lon), Number(item.lat), item.value, 100]
    }
  })
  console.log(data)

  return {
    name: 'company',
    type: 'effectScatter',
    effectType: 'ripple',
    rippleEffect: {
      period: 5,
      number: 4,
      scale: 4,
      brushType: 'stroke'
    },
    coordinateSystem: 'bmap',
    data: data,

    encode: {
      value: 2
    },
    symbolSize: 10,
    label: {
      show: false,
      formatter: '{@[2]}'
    },

    itemStyle: {
      color: '#f00'
    },
    emphasis: {
      label: {
        show: true
      }
    }
  }
}

const getOptions = () => ({
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: function (params) {
      console.log(params)
      return (
        '&nbsp;&nbsp;&nbsp;' +
        params.data.group +
        '<br />' +
        params.marker +
        params.name +
        ' : ' +
        params.value[2]
      )
    }
  },
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
  series: [addScatterLayer(mockList)]
})

const sheet = ref<HTMLDivElement>()

const initChart = () => {
  chart = echarts.init(sheet.value)
  echarts.registerMap('northEastL4', northEastL4 as any)
  echarts.registerMap('northEastL2', northEastL2 as any)
  chart.setOption(getOptions())
}

const getBaiduApi = () => {
  return chart.getModel().getComponent('bmap').getBMap()
}

const addGeoJson = (bmap) => {
  bmap.addOverlay(chinaJson)
}

const addChinaLayer = (bmap) => {
  const polygonStyle = {
    strokeWeight: 2,
    strokeColor: '#ff0000',
    fillColor: 'transparent',
    fillOpacity: 0
  }
  const province = [
    '内蒙古自治区',
    '黑龙江省',
    '吉林省',
    '辽宁省',
    '新疆',
    '西藏',
    '海南',
    '宁夏',
    '青海',
    '甘肃',
    '云南',
    '陕西',
    '河南',
    '山东',
    '江苏',
    '安徽',
    '湖北',
    '湖南',
    '江西',
    '四川',
    '重庆',
    '贵州',
    '广西',
    '广东',
    '北京',
    '上海',
    '天津',
    '河北'
  ]
  const bdary = new BMap.Boundary()
  province.forEach((name) => {
    bdary.get(name, function (rs) {
      console.log(rs)
      var count = rs.boundaries.length //行政区域的点有多少个
      if (count === 0) {
        alert('未能获取当前输入行政区域')
        return
      }
      var pointArray = []
      for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(rs.boundaries[i], polygonStyle) //建立多边形覆盖物
        bmap.addOverlay(ply) //添加覆盖物
        pointArray = pointArray.concat(ply.getPath())
      }
    })
  })
}

const customBMapArea = () => {
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
}

const driveApi = () => {
  function onSearchComplete(ridingRouteResult) {
    console.log(ridingRouteResult)

    let numPlans = ridingRouteResult.getNumPlans()
    console.log(numPlans) //返回方案个数

    let routePlan = ridingRouteResult.getPlan(0) //取第0（1）条路线规划
    let numRoutes = routePlan.getNumRoutes() //返回方案包含的线路的个数
  }
  var driving = new BMap.DrivingRoute(bMap, {
    renderOptions: {
      map: bMap,
      panel: mapResult.value,
      autoViewport: true
    },
    // policy: 'BMAP_DRIVING_POLICY_AVOID_HIGHWAYS',
    onSearchComplete
  })
  var start = new BMap.Point(116.310791, 40.003419)
  // var end = new BMap.Point(116.486419, 39.877282)
  var end = new BMap.Point(119.6, 39.93)
  driving.search(start, end)
  setTimeout(() => {
    console.log(driving.getResults())
  }, 3000)
}
const getLocation = () => {
  var geolocation = new BMap.Geolocation()
  geolocation.getCurrentPosition((res) => {
    console.log(res)
  })
}
/**
 * 创建交通图层
 */
const createTrafficLayer = () => {
  var traffic = new BMap.TrafficLayer() // 创建交通流量图层实例
  bMap.addTileLayer(traffic)
}

onMounted(() => {
  initChart()
  bMap = getBaiduApi()
  // createTrafficLayer()
  // driveApi()
  // addChinaLayer(bMap)
  addGeoJson(bMap)
})
</script>

<style lang="less" scoped>
.sheet {
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0%;
  left: 0%;
  z-index: 101;
  width: 100%;
  height: 100%;
  background: #fff;
}
.tool {
  display: true;
  position: absolute;
  z-index: 102;
  bottom: 0;
  right: 0;
  background: rgba(23, 49, 71, 0.8);
  width: 700px;
}
.map-result {
  position: absolute;
  right: 0;
  top: 120px;
  width: 500px;
  height: 400px;
  z-index: 2;
  background: #f00;
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
