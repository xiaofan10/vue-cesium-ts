<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" right="0" top="100" bottom="10" width="300" title="Particle">
      <p>
        <a-space>
          heading-左右摇头
          <mars-input
            v-model:value="heading"
            @change="onHeadingPitchRollChange"
            type="number"
            step="0.1"
          />
        </a-space>
      </p>
      <p>
        <a-space>
          pitch-抬头点头
          <mars-input
            v-model:value="pitch"
            @change="onHeadingPitchRollChange"
            type="number"
            step="0.1"
          />
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
      <p>
        <a-space>
          添加正方体
          <mars-button @click="addBoxEntity">添加正方体</mars-button>
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

const initCesium = () => {
  viewer = new Cesium.Viewer(cesiumContainer.value as HTMLElement, getDefaultConfig())
  viewer.scene.debugShowFramesPerSecond = true
  viewer.clock.shouldAnimate = true // 是否应该动画

  const canvas = viewer.canvas
  canvas.setAttribute('tabindex', '0') // needed to put focus on the canvas
  canvas.addEventListener('click', function () {
    canvas.focus()
  })
  canvas.focus()

  const scene = viewer.scene

  const pathPosition = new Cesium.SampledPositionProperty()
  const entityPath = viewer.entities.add({
    position: pathPosition,
    name: 'path',
    path: {
      show: true,
      leadTime: 0,
      trailTime: 60,
      width: 10,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        taperPower: 0.3,
        color: Cesium.Color.PALEGOLDENROD
      })
    }
  })
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
