<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" left="10" top="10" bottom="10" width="300" title="UI组件展示">
      <a-space>
        材料特效
        <mars-select
          ref="select"
          v-model:value="materialTypeValue"
          :options="materialOptions"
          style="width: 120px"
          @change="onMaterialChange"
        >
        </mars-select>
      </a-space>
      <p>
        <mars-button @click="setDynamicGeoEdge">设置流动边界地图图层</mars-button>
        <mars-button @click="setLoadGeo">设置地形地图图层</mars-button>
      </p>
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import { Math3d } from '@/lib/cesium/math/math'
import chinaGeoJson from '@/assets/geo/chinaGeoJson.json'
console.log(chinaGeoJson)

let viewer
let math3d
const cesiumContainer = ref<any>(null)
const materialTypeValue = ref<string>('')
const materialOptions = reactive([
  {
    value: '',
    label: '请选择特效'
  },
  {
    value: 'pathTrajectory',
    label: '飞机航线'
  }
])

const dialogVisible = ref<Boolean>(false)

const handleDialog = () => {
  dialogVisible.value = !dialogVisible.value
}

const removeEntities = () => {
  viewer.entities.removeAll()
}
const setRadarLine = () => {
  const ellipse = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      height: 1000,
      material: new Cesium.Scene.RadarLineMaterialProperty({
        color: Cesium.Color.GREEN,
        speed: 20
      })
    }
  })
  viewer.zoomTo(ellipse)
}

const setRadarScan = () => {
  const ellipse = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    ellipse: {
      semiMajorAxis: 1000,
      semiMinorAxis: 1000,
      height: 1000,
      material: new Cesium.Scene.RadarScanMaterialProperty({
        color: Cesium.Color.GREEN,
        speed: 20
      })
    }
  })
  viewer.zoomTo(ellipse)
}

const setDynamicGeoEdge = () => {
  chinaGeoJson.arcs.forEach((item, i) => {
    const color = Cesium.Color.fromRandom()
    viewer.entities.add({
      polyline: {
        positions: item.map((pos) => {
          return Cesium.Cartesian3.fromDegrees(...pos)
        }),
        width: 3,
        // @ts-ignore
        material: new Cesium.Scene.PolylineLightMaterialProperty({
          color: color,
          duration: 5000
        })
      }
    })
  })
}

const createTrajectoryPolyline = (options) => {
  const { positions, duration = 5000 } = options
  const JLTime = (start?, end?) => {
    // 中国时间
    const startDate = start ? new Date(start) : new Date()
    // time的时间戳
    let startTimestamp = startDate.getTime()
    let startTime = startDate
    // 朱利安时间
    let startJLTime = Cesium.JulianDate.fromDate(startDate)

    const stopDate = end ? new Date(end) : startDate
    // time的时间戳
    let stopTimestamp = stopDate.getTime()
    let stopTime = stopDate
    // 朱利安时间
    let stopJLTime = Cesium.JulianDate.fromDate(stopDate)

    return {
      startTime,
      startTimestamp,
      startJLTime,
      stopTime,
      stopTimestamp,
      stopJLTime
    }
  }

  const timeObj = JLTime()

  // 简单的位置属性，用来做路径回放,移动entity的position属性
  const property = new Cesium.SampledPositionProperty()
  positions.forEach((pos, i) => {
    const posTimestamp = timeObj.startTimestamp + i * duration
    const posTime = new Date(posTimestamp)
    timeObj.stopTime = posTime
    property.addSample(Cesium.JulianDate.fromDate(posTime), pos)
  })
  // 设置差值，每次变化的度数
  property.setInterpolationOptions({
    interpolationDegree: 0.1, // 插值变化度数
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation // 插值规则（默认的）
  })

  const entities = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({
        start: Cesium.JulianDate.fromDate(timeObj.startTime),
        stop: Cesium.JulianDate.fromDate(timeObj.stopTime)
      })
    ]),
    position: property,
    polyline: {
      positions,
      width: 5,

      material: new Cesium.Scene.PolylineDynamicMaterialProperty({
        color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 0.5),
        duration: 1500
      })
    },
    path: {
      leadTime: 0,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.GREEN
      }),
      width: 20
    },
    model: {
      uri: '/assets/glb/air.glb'
    },
    orientation: new Cesium.VelocityOrientationProperty(property) // 朝向
  })

  // viewer.clock.onTick.addEventListener((tick) => {
  //   const pathTick = entities.position.getValue(tick.currentTime)
  //   if (pathTick) {
  //     const cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pathTick)
  //     cartographic.longitude = Cesium.Math.toDegrees(cartographic.longitude)
  //     cartographic.latitude = Cesium.Math.toDegrees(cartographic.latitude)
  //     entities.label.text = cartographic.longitude ? Number(cartographic.longitude).toFixed(4) : ''
  //   }
  // })
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(timeObj.startTime)
  viewer.clock.stopTime = Cesium.JulianDate.fromDate(timeObj.stopTime)
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  viewer.clock.shouldAnimate = true
  return entities
}

const setCamera = () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.2317, 39.5427, 20000000.0),
    //包含方向和向上属性或航向、俯仰和滚动属性的物体。默认情况下，方向将指向框架的中心在3D 和负 z 方向在哥伦布视图。
    //上行方向将指向当地北部的3D 和正 y 方向的哥伦布视图。在无限滚动模式下，2D 中不使用定位。
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0
    }
  })
}
const setLoadGeo = async () => {
  // removeEntities()
  const chinaGeoJson = await Cesium.GeoJsonDataSource.load('/assets/geo/china.topo.json')
  const entities = chinaGeoJson.entities.values
  console.log(entities)
  entities.forEach((item: any, i) => {
    const color = Cesium.Color.fromRandom()
    item.type = 'map'
    if (item.polygon?.material) {
      item.polygon.material = color
      item.polygon.extrudedHeight = Math.ceil(Math.random() * 1000000) % 500000
      item.polygon.outline = false
      // item.polygon.outlineWidth = 100
      // item.polygon.outlineColor = new Cesium.Scene.PolylineLightMaterialProperty({
      //   color: Cesium.Color.BLUE,
      //   duration: 1500
      // })
      // Cesium.Color.fromAlpha(Cesium.Color.YELLOW, 1.0)
      // item.polygon.fill = false
      if (item.properties.center) {
        const center = item.properties.center.getValue()
        item.position = Cesium.Cartesian3.fromDegrees(center[0], center[1], 0)
        item.label = {
          text: item.name,
          font: '10px sans-serif',
          fillColor: Cesium.Color.BLACK,
          outlineColor: Cesium.Color.RED,
          outlineWidth: 5,

          showBackground: false,
          backgroundColor: Cesium.Color.BLUE,
          translucencyByDistance: new Cesium.NearFarScalar(10000000, 1.0, 20000000, 0.0)
        }
      }
    }
  })
  viewer.dataSources.add(chinaGeoJson)
  const handle = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handle.setInputAction((res) => {
    const feature = viewer.scene.pick(res.position)
    if (feature?.id?.polygon) {
      entities.forEach((item) => {
        if (item.polygon) {
          // @ts-ignore
          item.polygon.extrudedHeight = 10
        }
      })
      feature.id.polygon.extrudedHeight = 1000000
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
}

const onMaterialChange = (val) => {
  removeEntities()
  switch (val) {
    case 'RadarLine':
      setRadarLine()
      break

    default:
  }
}

function initCesium() {
  // Cesium.Ion.defaultAccessToken =
  //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2UyZDI3NS02M2NjLTQ1OTUtODBmMC03YWNhYzk1NzU2M2MiLCJpZCI6MTU2MDQyLCJpYXQiOjE2OTAyMDc4ODR9.BmN3pOpnSPgJa2eBzYBHt5xrnMaIlV7MdcNrvowXpfs'
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    ...getDefaultConfig()
  })
  viewer.clock.shouldAnimate = true
  math3d = new Math3d(viewer, Cesium)
}

onMounted(() => {
  initCesium()
  setCamera()
})
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  .cesium-container {
    width: 100%;
    height: 100%;
  }
}
</style>
