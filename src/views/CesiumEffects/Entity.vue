<template>
  <div class="container">
    <div class="cesium-container" ref="cesiumContainer"></div>
    <mars-dialog :visible="true" left="100" top="10" bottom="10" width="300" title="Entity">
      <p>
        <a-space>
          增加
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
          添加
          <mars-button @click="addBall"> 球 </mars-button>
        </a-space>
      </p>
      <p>
        <mars-button @click="onSetTo"> 定位 </mars-button>
        <mars-button @click="onSetLookAtTo"> 锁定到一点 </mars-button>
      </p>
      <p>
        <mars-button @click="addEntityEvent"> 实体事件 </mars-button>
      </p>
    </mars-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { getDefaultConfig } from '@/utils/cesiumUtils'
import { Math3d } from '@/lib/cesium/math/math'
import * as Cesium from 'cesium'
import * as TWEEN from '@tweenjs/tween.js'

let viewer: Cesium.Viewer
let math3d
const cesiumContainer = ref<any>(null)

const heading = ref(0)
const pitch = ref(-90)
const roll = ref(0)
const position: [number, number, number] = [116.2529, 39.542, 100000]

const addBall = () => {
  const entity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(...position),
    ellipsoid: {
      radii: new Cesium.Cartesian3(1000, 1000, 1000)
    }
  })
  viewer.zoomTo(entity)
  // 定义目标位置 B
  var targetPosition = Cesium.Cartesian3.fromDegrees(-75.0, 40.0, 0)

  // 使用 Tween 动画库实现球体从 A 移动到 B 的效果
  var startTime = new Date().getTime()
  var duration = 3000 // 移动时间为 3 秒

  var tween = new TWEEN.Tween({})
    .to({}, duration)
    .onUpdate(function (time) {
      var elapsed = time - startTime
      var t = Cesium.Math.clamp(elapsed / duration, 0, 1)
      var newPosition = Cesium.Cartesian3.lerp(
        entity.position.getValue(startTime, new Cesium.Cartesian3()),
        targetPosition,
        t,
        new Cesium.Cartesian3()
      )
      entity.position.setValue(newPosition)
    })
    .start()

  // 帧更新函数，用于更新 Tween 动画和场景渲染
  function animate() {
    requestAnimationFrame(animate)
    TWEEN.update()
    viewer.render()
  }

  animate()
}

const addEntityEvent = () => {
  viewer.screenSpaceEventHandler.setInputAction(function (e) {
    var pickedEntity = viewer.scene.pick(e.endPosition)
    // 如果实体存在且为我们添加的椭球体实体
    if (Cesium.defined(pickedEntity)) {
      // 设置鼠标样式为指针样式
      if (viewer.container['style'].cursor != 'cursor') {
        viewer.container['style'].cursor = 'pointer'
      }
    } else {
      if (viewer.container['style'].cursor != 'default') {
        viewer.container['style'].cursor = 'default'
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
}

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
