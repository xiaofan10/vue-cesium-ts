<script setup lang="ts">
import { inject, onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import { Math3d } from '@/lib/cesium/math/math'

const Cesium: any = inject('Cesium')
let viewer
let math3d
const cesiumContainer = ref<any>(null)
const materialTypeValue = ref<string>('')
const materialOptions = reactive([
  {
    value: '',
    label: '无'
  },
  {
    value: 'RadarLine',
    label: '简单雷达'
  },
  {
    value: 'RadarScan',
    label: '雷达扫描'
  },
  {
    value: 'PolylineLight',
    label: '城市路线'
  },
  {
    value: 'PolylineDynamic',
    label: '动态轨迹'
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
const setPolylineLight = () => {
  const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.9236839, 22.528061),
    polyline: {
      positions: [
        Cesium.Cartesian3.fromDegrees(113.9236839, 23.528061),
        Cesium.Cartesian3.fromDegrees(115.9236839, 23.528061),
        Cesium.Cartesian3.fromDegrees(115.9236839, 24.528061)
      ],
      width: 5,
      material: new Cesium.Scene.PolylineLightMaterialProperty({
        color: new Cesium.Color(5.0, 5.0, 10.0),
        duration: 1500
      })
    }
  })
  viewer.zoomTo(entity)
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

const setPolylineDynamic = () => {
  const startPoint = Cesium.Cartesian3.fromDegrees(104.081701757991, 30.627042558105988)
  const endPoint = Cesium.Cartesian3.fromDegrees(
    Math.random() / 100 + 104.081701757991,
    Math.random() / 100 + 30.627042558105988
  )
  const positions = math3d.getLinkedPointList(startPoint, endPoint, 100000, 50)
  // const entity = viewer.entities.add({
  //   polyline: {
  //     positions,
  //     width: 5,
  //     material: new Cesium.Scene.PolylineDynamicMaterialProperty({
  //       color: new Cesium.Color(255 / 255, 201 / 255, 38 / 255, 0.5),
  //       duration: 1500
  //     })
  //   }
  // })
  const entity = createTrajectoryPolyline({ positions, duration: 800 })

  viewer.zoomTo(entity)
}

const onMaterialChange = (val) => {
  console.log(val)
  removeEntities()
  switch (val) {
    case 'RadarLine':
      setRadarLine()
      break
    case 'RadarScan':
      setRadarScan()
      break
    case 'PolylineLight':
      setPolylineLight()
      break
    case 'PolylineDynamic':
      setPolylineDynamic()
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
})
</script>

<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" left="10" top="10" bottom="10" width="300" title="UI组件展示">
      <a-space>
        Select
        <mars-select
          ref="select"
          v-model:value="materialTypeValue"
          :options="materialOptions"
          style="width: 120px"
          @change="onMaterialChange"
        >
        </mars-select>
      </a-space>
    </mars-dialog>
  </div>
</template>

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
