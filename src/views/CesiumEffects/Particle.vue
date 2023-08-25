<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="0" top="100" bottom="10" width="300" title="Particle">
      <p>
        <a-space>
          heading-左右摇头
          <mars-input v-model:value="heading" @change="onHeadingPitchRollChange" type="number" />
        </a-space>
      </p>
      <p>
        <a-space>
          pitch-抬头点头
          <mars-input v-model:value="pitch" @change="onHeadingPitchRollChange" type="number" />
        </a-space>
      </p>
      <p>
        <a-space>
          roll-翻转
          <mars-input
            v-model:value="roll"
            @change="onHeadingPitchRollChange"
            type="number"
            step="0.1"
          />
        </a-space>
      </p>
    </mars-dialog>
    <div id="toolbar"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import { getDefaultConfig } from '@/utils/cesiumUtils'

const heading = ref(0)
const pitch = ref(0)
const roll = ref(0)

let viewer: Cesium.Viewer
const cesiumContainer = ref<HTMLElement | null>(null)
let particleSystem: Cesium.ParticleSystem

const computedModeMatrix = ({ lon, lat, height }) => {
  const center = Cesium.Cartesian3.fromDegrees(lon, lat, height)
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(center)
  // 将笛卡尔坐标位置转换成矩阵
  return matrix
}

const computedEmitterModeMatrix = () => {
  const hpr = new Cesium.HeadingPitchRoll(
    Number(heading.value),
    Number(pitch.value),
    Number(roll.value)
  )
  const trs = new Cesium.TranslationRotationScale() // 用于平移 旋转 缩放 对象
  trs.translation = new Cesium.Cartesian3(0, 0, 0)
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr)
  const modelMatrix = new Cesium.Matrix4()
  const matrix4 = Cesium.Matrix4.fromTranslationQuaternionRotationScale(
    trs.translation,
    trs.rotation,
    trs.scale,
    modelMatrix
  )
  return matrix4
}

const onHeadingPitchRollChange = (val: number) => {
  if (particleSystem) {
    particleSystem.emitterModelMatrix = computedEmitterModeMatrix()
  }
}

const initClock = () => {
  viewer.clock.shouldAnimate = true // 是否应该动画
  // 创建粒子系统
  particleSystem = viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      image: '/assets/images/particle/smoke.png', // 设置粒子图片路径
      imageSize: new Cesium.Cartesian2(1.0, 1.0),
      startColor: Cesium.Color.RED, // 起始颜色
      endColor: Cesium.Color.YELLOW, // 结束颜色
      startScale: 1.0, // 起始大小
      endScale: 10, // 结束大小
      emissionRate: 50, // 每秒发射的粒子数量
      minimumParticleLife: 2.0, // 最小粒子寿命
      maximumParticleLife: 5.0, // 最大粒子寿命
      sizeInMeters: false, // 是否以米为单位计算粒子大小
      minimumSpeed: 1.0, // 最小速度
      maximumSpeed: 10.0, // 最大速度
      emitter: new Cesium.CircleEmitter(Cesium.Math.toRadians(20.0)), // 设置锥形发射器
      // lifetime: 10000.0, // 整体粒子系统的寿命
      modelMatrix: computedModeMatrix({ lon: -75.0, lat: 40.0, height: 1000.0 }), // 设置模型矩阵
      emitterModelMatrix: computedEmitterModeMatrix() // 设置发射器模型矩阵
    })
  )
  // viewer.zoomTo(particleSystem)

  // 设置粒子系统的位置
  var camera = viewer.scene.camera

  // 设置摄像机位置和朝向，以便能够看到粒子系统
  camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-75.0, 39.9993, 1050.0), // 设置目标位置
    orientation: {
      heading: Cesium.Math.toRadians(0.0), // 设置朝向
      pitch: Cesium.Math.toRadians(-20.0), // 设置倾斜角度
      roll: 0.0 // 设置滚动角度
    }
  })
}

const initCesium = () => {
  viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement, getDefaultConfig())
  viewer.scene.debugShowFramesPerSecond = true
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
