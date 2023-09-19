<template>
  <div :class="['menu', { expanded: menuExpanded }]">
    <div
      :class="['hamburger', { expanded: menuExpanded }]"
      ref="hamburger"
      :style="hamburgerStyleComputed"
      @mouseenter="onInnerMouseEnter"
    >
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="menu-inner" @mouseenter="onInnerMouseEnter" @mouseleave="onInnerMouseLeave">
      <ul>
        <template v-for="item in data" :key="item.path">
          <li class="menu-item">
            <router-link v-if="item.children?.length" :to="item.path">{{
              item.meta.title
            }}</router-link>
            <div v-else>{{ item.meta.title }}</div>
            <template v-if="item.children">
              <ul>
                <li class="menu-item" v-for="cItem in item.children" :key="cItem.path">
                  <router-link :to="`${item.path}/${cItem.path}`">{{
                    cItem.meta.title
                  }}</router-link>
                </li>
              </ul>
            </template>
          </li>
        </template>
      </ul>
    </div>

    <svg
      version="1.1"
      id="blob"
      ref="blob"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <path id="blob-path" ref="blobPath" :d="newCurve2" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const props = defineProps<{
  data: any[]
}>()

const blob = ref<HTMLElement>()
const blobPath = ref<HTMLElement>()
const hamburger = ref<HTMLElement>()
const menuExpanded = ref(false)

let height = window.innerHeight,
  x = 0,
  y = height / 2,
  targetX = 0,
  xitteration = 0,
  yitteration = 0
var hoverZone = 150
var expandAmount = 20
const curveX = ref(10)
const curveY = ref(0)
const newCurve2 = ref('M60,500H0V0h60c0,0,20,172,20,250S60,900,60,500z')
const hamburgerStyleComputed = computed(() => {
  return {
    transform: `translate(${curveX.value}px, ${curveY.value}px)`
  }
})

function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
  return changeInValue * (-Math.pow(2, (-10 * currentIteration) / totalIterations) + 1) + startValue
}

function svgCurve() {
  if (curveX.value > x - 1 && curveX.value < x + 1) {
    xitteration = 0
  } else {
    if (menuExpanded.value) {
      targetX = 0
    } else {
      xitteration = 0
      if (x > hoverZone) {
        targetX = 0
      } else {
        targetX = -(((60 + expandAmount) / 100) * (x - hoverZone))
      }
    }
    xitteration++
  }

  if (curveY.value > y - 1 && curveY.value < y + 1) {
    yitteration = 0
  } else {
    yitteration = 0
    yitteration++
  }

  curveX.value = easeOutExpo(xitteration, curveX.value, targetX - curveX.value, 100)
  curveY.value = easeOutExpo(yitteration, curveY.value, y - curveY.value, 100)

  var anchorDistance = 200
  var curviness = anchorDistance - 40

  newCurve2.value = `M60, ${height}H0V0h60v${curveY.value - anchorDistance}c0,${curviness},${
    curveX.value
  },${curviness},${curveX.value},${anchorDistance}S60,${curveY.value},60,${
    curveY.value + anchorDistance * 2
  }V${height}z`

  blob.value?.setAttribute('width', curveX.value + 60 + 'px')

  window.requestAnimationFrame(svgCurve)
}

const onInnerMouseEnter = () => {
  menuExpanded.value = true
}
const onInnerMouseLeave = () => {
  menuExpanded.value = false
}
onMounted(() => {
  window.addEventListener('mousemove', function (e) {
    x = e.pageX

    y = e.pageY
  })
  window.requestAnimationFrame(svgCurve)
})
</script>

<style lang="less" scoped>
.menu {
  height: 100%;
  position: fixed;
  background-color: #fed057;
  width: 300px;
  transition: 1000ms all cubic-bezier(0.19, 1, 0.22, 1);
  transform: translateX(-100%);
  left: 60px;
  z-index: 100;
  &.expanded {
    transform: translateX(0%);
    left: 0px;
  }
}

.menu-inner {
  width: 100%;
  height: 100%;
  position: relative;
  &.expanded {
    transform: translateX(0%);
    left: 0px;
  }
}
.menu-item {
  padding: 5px 10px;
}

#blob {
  top: 0;
  z-index: -1;
  right: 60px;
  transform: translateX(100%);
  height: 100%;
  position: absolute;
}

#blob-path {
  height: 100%;
  fill: #fed057;
}

.hamburger {
  right: 20px;
  position: absolute;
  width: 20px;
  height: 20px;
  margin-top: -10px;
}

.hamburger .line {
  width: 100%;
  height: 4px;
  background-color: #fff;
  position: absolute;
}

.hamburger .line:nth-child(2) {
  top: 50%;
  margin-top: -2px;
}

.hamburger .line:nth-child(3) {
  bottom: 0;
}
</style>
<style>
body,
html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #26394e;
}
h1 {
  position: fixed;
  right: 0;
  margin: 0;
}
/* 
ul {
  padding: 0;
  list-style: none;
  width: 80%;
  margin-left: 10%;
  position: absolute;
  top: 10px;
} */

ul {
  color: #fff;
  font-family: sans-serif;
  padding: 20px 0;
}
</style>
