<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" left="100" top="10" bottom="10" width="300" title="Camera">
      <p>
        <a-space>
          heading-左右摇头
          <mars-input v-model:value="heading" @change="headingChange" type="number" />
        </a-space>
      </p>
      <p>
        <a-space>
          pitch-抬头点头
          <mars-input v-model:value="pitch" @change="pitchChange" type="number" />
        </a-space>
      </p>
      <p>
        <a-space>
          roll-翻转
          <mars-input v-model:value="roll" @change="rollChange" type="number" step="0.1" />
        </a-space>
      </p>
      <p>
        <a-space>
          北京116.2529,39.5420
          <mars-button @click="onFlyTo"> 飞行 </mars-button>
          <mars-button @click="onCancelFly"> 取消飞行 </mars-button>
        </a-space>
      </p>
      <p>
        <mars-button @click="onSetTo"> 定位 </mars-button>
        <mars-button @click="onSetLookAtTo"> 锁定到一点 </mars-button>
      </p>
      <p>
        <mars-button @click="addEvent"> 相机事件 </mars-button>
      </p>
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import { Math3d } from '@/lib/cesium/math/math'
import * as Cesium from 'cesium'

let viewer: Cesium.Viewer
let math3d
const cesiumContainer = ref<any>(null)
const materialTypeValue = ref<string>('')
const materialOptions = reactive([
  {
    value: '',
    label: '请选择特效'
  },
  {
    value: 'RadarLine',
    label: '简单雷达'
  }
])

const heading = ref(0)
const pitch = ref(-90)
const roll = ref(0)
const position: [number, number, number] = [116.2529, 39.542, 10000]
const onFlyTo = () => {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(...position),
    duration: 2,
    complete() {
      console.log('飞行结束啦')
    },
    cancel() {
      console.log('取消飞行')
    }
  })
}
const onCancelFly = () => {
  viewer.camera.cancelFlight()
}
const onSetTo = () => {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(...position)
  })
}
const onSetLookAtTo = () => {
  viewer.camera.lookAt(
    Cesium.Cartesian3.fromDegrees(...position),
    new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(0), 10)
  )
}

const headingChange = (e) => {
  const val = e.target.value || 0
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(...position),
    orientation: {
      heading: Cesium.Math.toRadians(Number(val)),
      pitch: Cesium.Math.toRadians(Number(pitch.value)),
      roll: Number(roll.value)
    }
  })
}

const pitchChange = (e) => {
  const val = e.target.value || 0
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(...position),
    orientation: {
      heading: Cesium.Math.toRadians(Number(heading.value)),
      pitch: Cesium.Math.toRadians(Number(val)),
      roll: Number(roll.value)
    }
  })
}

const rollChange = (e) => {
  const val = e.target.value || 0
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(...position),
    orientation: {
      heading: Cesium.Math.toRadians(Number(heading.value)),
      pitch: Cesium.Math.toRadians(Number(pitch.value)),
      roll: Number(val)
    }
  })
}

// Event
const addEvent = () => {
  // 相机位置改变触发 不灵敏
  viewer.camera.changed.addEventListener((...arg) => {
    console.log('changed', ...arg)
  })
  viewer.camera.moveStart.addEventListener((...arg) => {
    // 用户开始移动相机时执行的代码
    console.log('moveStart', ...arg)
  })

  viewer.camera.moveEnd.addEventListener((...arg) => {
    // 用户结束移动相机时执行的代码
    console.log('moveEnd', ...arg)
  })
}

function initCesium() {
  viewer = new Cesium.Viewer(cesiumContainer.value, {
    ...getDefaultConfig()
  })
  viewer.clock.shouldAnimate = true
  math3d = new Math3d(viewer, Cesium)

  viewer.scene.globe.depthTestAgainstTerrain = true
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
