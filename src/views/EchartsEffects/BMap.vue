<template>
  <div class="sheet" ref="sheet"></div>
  <div class="map-result" ref="mapResult"></div>
  <div class="tool" v-if="startPoint.length">
    <mars-table
      :columns="columns"
      :data-source="data"
      :scroll="{ y: 240 }"
      :customRow="
        (record) => ({
          onClick: () => handleSelect(record)
        })
      "
    >
      <!-- <template #action>
        <a>action</a>
      </template> -->
    </mars-table>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import registerBMap from '@/utils/bmap'
import { computed, onMounted, ref, watch } from 'vue'
import mockList from '@/assets/mock/companys.js'
import northEastL4 from '@/assets/geo/northEastL4.json'
import northEastL2 from '@/assets/geo/northEastL2.json'
import chinaJson from '@/assets/geo/china.json'
import bmapJson from '@/assets/geo/bmap.json'
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

let map: any
let BMap: any

const mapResult = ref<HTMLDivElement>()
const startPoint = ref<any[]>([]) // 检索起点
const data = ref<any[]>([]) // table 数据
const sheet = ref<HTMLDivElement>()

const addScatterLayer = (dataSource) => {
  const data = dataSource.map((item) => {
    return {
      group: item.group,
      name: item.company,
      value: [Number(item.lon), Number(item.lat), item.value, 100]
    }
  })

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

interface tMap {
  [propName: string]: any
}

class Map {
  chart: any
  dom: any
  control = {
    scale: null,
    navigation: null
  }
  bmap: any
  routes: any = {}
  defaultStyle = {
    strokeColor: '#f00',
    strokeOpacity: 0.5,
    strokeWeight: 6
  }
  hoverStyle = {
    strokeOpacity: 1,
    strokeWeight: 10
  }
  constructor(dom) {
    this.dom = dom
    this.initChart()
    this.initControl()
  }

  initChart() {
    const chart = echarts.init(this.dom)
    echarts.registerMap('northEastL4', northEastL4 as any)
    echarts.registerMap('northEastL2', northEastL2 as any)
    const option: any = this.getOption(data.value)
    chart.setOption(option)
    this.chart = chart
    this.bmap = this.getBaiduApi()
  }

  getOption(data) {
    return {
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
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
        center: [116.31082245027, 40.003417973876],
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
      series: [addScatterLayer(data)]
    }
  }

  getBaiduApi() {
    return this.chart.getModel().getComponent('bmap').getBMap()
  }

  initControl() {
    const { control } = this
    // 左上角，添加比例尺
    control.scale = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT })
    control.navigation = new BMap.NavigationControl({
      anchor: BMAP_ANCHOR_TOP_LEFT, // 方位
      type: BMAP_NAVIGATION_CONTROL_SMALL // 控件类型
    })
    /*
      缩放控件type有四种类型:
      BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；
      BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；
      BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮
    */
  }

  addBmapControl() {
    const { control, bmap } = this
    bmap.addControl(control.scale)
    bmap.addControl(control.navigation)
  }

  removeBmapControl() {
    const { control, bmap } = this
    bmap.removeControl(control.scale)
    bmap.removeControl(control.navigation)
  }

  /**
   * 创建交通图层
   */
  createTrafficLayer() {
    const traffic = new BMap.TrafficLayer() // 创建交通流量图层实例
    this.bmap.addTileLayer(traffic)
  }

  bindEvent(callback) {
    this.bmap.addEventListener('click', (e) => {
      var point = e.point // 获取点击位置的经纬度信息
      startPoint.value = [point.lng, point.lat]
      data.value = []
      this.clearRoute()
      data.value = mockList
    })
  }
  /**
   * 增加
   * @param route
   */
  addRoute(route): Map {
    const { routes } = this
    if (!routes[route.type]) {
      routes[route.type] = route
      this.drawRoute(route)
    }
    return this
  }

  removeRoute(route): Map {
    const { routes } = this
    if (routes[route.type]) {
      // this.removeOverlay(routes[route.type].overlay)
      delete routes[route.type]
    }
    return this
  }
  /**
   * 清除所有route
   */
  clearRoute() {
    const { routes } = this
    for (let key in routes) {
      this.removeOverlay(routes[key].overlay)
      delete routes[key]
    }
  }

  addHoverRoute(route) {
    const { routes } = this
    if (routes[route.type]) {
      routes[route.type].isHover = true
      // this.removeOverlay(routes[route.type].overlay)
      this.drawHoverRoute(routes[route.type])
    }
    return this
  }

  removeHoverRoute() {
    const { routes } = this
    for (let key in routes) {
      if (routes[key].isHover) {
        routes[key].isHover = false
        console.log('ksksk')
        this.removeOverlay(routes[key].overlay)
      }
    }
    return this
  }
  /**
   * 清楚某个覆盖物
   */
  removeOverlay(overlay) {
    const { bmap } = this
    bmap.removeOverlay(overlay)
  }
  /**
   * 清楚所有覆盖物
   */
  clearOverlays() {
    this.bmap.clearOverlays()
    return this
  }

  drawRoute(route) {
    const { bmap, routes, defaultStyle, hoverStyle } = this
    const getRandomRGB = () => (Math.random() * 1000) % 255
    let group = routes
    if (route) {
      group = [route]
    }
    Object.values(group).forEach((item: any) => {
      const style = {
        ...defaultStyle,
        enableMassClear: true,
        strokeColor: `rgb(${getRandomRGB()},${getRandomRGB()},${getRandomRGB()})`
      }
      if (item.isHover) {
        Object.assign(style, hoverStyle)
      }
      const polyline = new BMap.Polyline(item.route, style)
      item.overlay = polyline
      bmap.addOverlay(polyline)
    })
  }
  drawHoverRoute(route) {
    const { bmap, defaultStyle, hoverStyle } = this
    if (route.isHover) {
      const style = { ...defaultStyle, ...hoverStyle, enableMassClear: true }
      const polyline = new BMap.Polyline(route.route, style)
      route.overlay = polyline
      bmap.addOverlay(polyline)
    }
  }

  /**
   * 使用百度 BMap.DrivingRoute 绘制路线图
   */
  searchRoute(start, end) {
    const { bmap } = this
    const type = `${start[0]}|${start[1]}-${end[0]}|${end[1]}`
    function onMarkers(point) {
      const url = '/assets/images/markers.png'
      const width = 42
      const height = 34
      const myIcon = new BMap.Icon(url, new BMap.Size(width, height), {
        offset: new BMap.Size(14, 32),
        imageOffset: new BMap.Size(0, 0)
      })
      var marker = new BMap.Marker(point, { icon: myIcon })
      marker.setTop(true)
      bmap.addOverlay(marker)
    }
    const onSearchComplete = (res) => {
      let numPlans = res.getNumPlans() //返回规划方案的个数
      let routePlan = res.getPlan(0) //取第0（1）条路线规划
      let numRoutes = routePlan.getNumRoutes() //返回方案包含的线路的个数
      const route = routePlan.getRoute(0) //返回第一条线路
      const path = route.getPath()
      const distance = route.getDistance()
      const duration = routePlan.getDuration()
      this.addRoute({
        type,
        distance,
        duration,
        route: path
      })
    }
    const driving = new BMap.DrivingRoute(bmap, {
      onSearchComplete
    })
    var startPoint = new BMap.Point(...start)
    var endPoint = new BMap.Point(...end)
    driving.search(startPoint, endPoint)
  }

  drawCustomRoute(bmapJson) {
    const { bmap } = this
    const routes: any[] = []
    bmapJson.result.routes.forEach((route) => {
      route.steps.forEach((item) => {
        item.path.split(';').forEach((a) => {
          const coord = a.split(',')
          const point = new BMap.Point(...coord)
          routes.push(point)
        })
      })
    })
    const polyline = new BMap.Polyline(routes, {
      strokeColor: '#f00',
      strokeOpacity: 1,
      strokeWeight: 6,
      enableMassClear: true
    })
    bmap.addOverlay(polyline)
    bmap.setViewport(routes)
  }
  /**
   * 异步获得当前位置坐标
   */
  getLocation() {
    var geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition((res) => {
      console.log(res)
    })
  }

  /**
   * 增加绘制区域图层
   */
  addAreaLayer = () => {
    const { bmap } = this
    const getRandomRGB = () => (Math.random() * 1000) % 255
    const polygonStyle = {
      strokeWeight: 2,
      strokeColor: `rgb(${getRandomRGB()},${getRandomRGB()},${getRandomRGB()})`,
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
}

const addGeoJson = (bmap) => {
  bmap.addOverlay(chinaJson)
}

watch(
  data,
  (newValue, oldValue) => {
    map.chart.setOption(map.getOption(newValue))
    newValue.forEach((item) => {
      map.searchRoute(startPoint.value, item.point)
    })
  },
  {
    deep: true
  }
)

const handleSelect = (arg) => {
  map.removeHoverRoute()
  map.addHoverRoute({
    type: `${startPoint.value[0]}|${startPoint.value[1]}-${arg.point[0]}|${arg.point[1]}`
  })
}

onMounted(() => {
  registerBMap.init().then((res) => {
    BMap = res
    map = new Map(sheet.value)
    map.addBmapControl()
    map.bindEvent()
    map.searchRoute([116.310791, 40.003419], [119.6, 39.93])
  })
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
