<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="0" top="100" bottom="10" width="300" title="Particle">
      <p>
        <a-space> heading-左右摇头 </a-space>
      </p>
    </mars-dialog>
    <div id="toolbar"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import { getDefaultConfig } from '@/utils/cesiumUtils'
let viewer: Cesium.Viewer
const cesiumContainer = ref<HTMLElement | null>(null)
const time = Cesium.JulianDate.fromDate(new Date(2023, 8, 23, 16))
const clock = {
  start: time.clone(),
  stop: Cesium.JulianDate.addSeconds(time, 120, new Cesium.JulianDate())
}

const initClock = () => {
  viewer.clock.startTime = clock.start.clone()
  viewer.clock.stopTime = clock.stop.clone()
  viewer.clock.currentTime = clock.start.clone()
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP
  viewer.clock.multiplier = 1
  viewer.clock.shouldAnimate = true

  const computedModeMatrix = ({ lon, lat, height }) => {
    const center = Cesium.Cartesian3.fromDegrees(lon, lat, height)
    const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
    // 将笛卡尔坐标位置转换成矩阵
    return matrix
  }

  const computedEmitterModeMatrix = () => {
    const hpr = Cesium.HeadingPitchRoll.fromDegrees(0, 0, 10)
    const trs = new Cesium.TranslationRotationScale()
    trs.translation = Cesium.Cartesian3.fromElements(0, 0, 0)
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr)
    const result = Cesium.Matrix4.fromTranslationRotationScale(trs)
    console.log(result)
    return result
  }

  // 创建粒子系统
  var particleSystem = viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      image: '/assets/images/particle/smoke.png', // 设置粒子图片路径
      startColor: Cesium.Color.RED, // 起始颜色
      endColor: Cesium.Color.YELLOW, // 结束颜色
      startScale: 1.0, // 起始大小
      endScale: 10, // 结束大小
      emissionRate: 100, // 每秒发射的粒子数量
      minimumParticleLife: 2.0, // 最小粒子寿命
      maximumParticleLife: 5.0, // 最大粒子寿命
      sizeInMeters: true, // 是否以米为单位计算粒子大小
      minimumSpeed: 1.0, // 最小速度
      maximumSpeed: 5.0, // 最大速度
      emitter: new Cesium.CircleEmitter(Cesium.Math.toRadians(20.0)), // 设置锥形发射器
      lifetime: 10000.0, // 整体粒子系统的寿命
      modelMatrix: computedModeMatrix({ lon: -75.0, lat: 40.0, height: 1000.0 }), // 设置模型矩阵
      emittterModelMatrix: computedEmitterModeMatrix() // 设置发射器模型矩阵
      // emitterModelMatrix: Cesium.Matrix4.fromTranslation(
      //   // 粒子发射器位置
      //   Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 100.0)
      // )
    })
  )
  // viewer.zoomTo(particleSystem)

  // 设置粒子系统的位置
  var camera = viewer.scene.camera

  // 设置摄像机位置和朝向，以便能够看到粒子系统
  camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1100.0), // 设置目标位置
    orientation: {
      heading: Cesium.Math.toRadians(0.0), // 设置朝向
      pitch: Cesium.Math.toRadians(-20.0), // 设置倾斜角度
      roll: 0.0 // 设置滚动角度
    }
  })
  // camera.direction = Cesium.Cartesian3.normalize(
  //   // 设置摄像机朝向
  //   Cesium.Cartesian3.subtract(
  //     Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 1000.0), // 粒子系统的位置
  //     camera.position,
  //     new Cesium.Cartesian3()
  //   ),
  //   new Cesium.Cartesian3()
  // )
  // camera.up = new Cesium.Cartesian3(0.0, 0.0, 1.0)
}

const initCesium = () => {
  viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement, getDefaultConfig())
  viewer.scene.debugShowFramesPerSecond = true
  // viewer.scene.debugShowCommands = false
  // viewer.scene.debugShowFrustumPlanes = true
  // viewer.scene.debugShowDepthFrustum = 1
  // viewer.scene.globe.enableLighting = true
  // viewer.scene.mode = Cesium.SceneMode.SCENE3D
  initClock()
}

onMounted(() => {
  initCesium()
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
