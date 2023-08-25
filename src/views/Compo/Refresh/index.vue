<template>
  <div ref="root" class="van-pull-refresh">
    <div
      ref="track"
      class="van-pull-refresh__track"
      :style="trackStyle"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancl="onTouchEnd"
    >
      <div class="van-pull-refresh__head">
        <div v-if="STATUS.includes(state.status)" class="van-pull-refresh__text">
          {{ getStatusText() }}
        </div>
        <div v-if="state.status == 'loading'" class="van-pull-refresh__text">loading</div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onMounted,
  computed,
  unref,
  defineEmits,
  onActivated,
  nextTick,
  onUnmounted,
  onDeactivated
} from 'vue'
import { useScrollParent, useTouch } from '@/hooks/index'

const DEFAULT_HEAD_HEIGHT = 50
const TEXT_STATUS = ['pulling', 'loosing', 'success']
const props = defineProps({
  headHeight: {
    type: [Number, String],
    default: DEFAULT_HEAD_HEIGHT
  },
  disabled: Boolean,
  successText: String,
  pullingText: String,
  loosingText: String,
  loadingText: String,
  modelValue: Boolean,
  pullDistance: [Number, String],
  successDuration: {
    type: [Number, String],
    default: 500
  },
  animationDuration: {
    type: [Number, String],
    default: 300
  }
})

const emit = defineEmits(['change', 'refresh', 'update:modelValue'])

type PullRefreshStatus = 'normal' | 'loading' | 'loosing' | 'pulling' | 'success'
type ScrollElement = Element | Window

let reachTop: boolean

const root = ref<HTMLElement>()
const track = ref<HTMLElement>()
const STATUS = ref(TEXT_STATUS)

const scrollParent = useScrollParent(root)

const state = reactive({
  status: 'normal' as PullRefreshStatus,
  distance: 0,
  duration: 0
})

const touch = useTouch()

const trackStyle = computed(() => ({
  transitionDuration: `${state.duration}ms`,
  transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : ''
}))

const getHeadStyle = () => {
  if (props.headHeight !== DEFAULT_HEAD_HEIGHT) {
    return {
      height: `${props.headHeight}px`
    }
  }
}

const isTouchable = () =>
  state.status !== 'loading' && state.status !== 'success' && !props.disabled

const ease = (distance: number) => {
  // 当移动距离大于 pullDistance 且小于2*pullDistance 时,有缓动，位移会多出（多出距离的一半）
  // 如果超出2*pullDistance,位移会为另一个缓动计算的距离
  const pullDistance = +(props.pullDistance || props.headHeight)
  if (distance > pullDistance) {
    if (distance < pullDistance * 2) {
      distance = pullDistance + (distance - pullDistance) / 2
    } else {
      distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
    }
  }
  // 四舍五入取整
  return Math.round(distance)
}

const setStatus = (distance: number, isLoading?: boolean) => {
  const pullDistance = +(props.pullDistance || props.headHeight)
  state.distance = distance

  if (isLoading) {
    state.status = 'loading'
  } else if (distance === 0) {
    state.status = 'normal'
  } else if (distance < pullDistance) {
    state.status = 'pulling'
  } else {
    state.status = 'loosing'
  }

  emit('change', {
    status: state.status,
    distance
  })
}

const getStatusText = () => {
  const { status } = state
  if (status === 'normal') {
    return ''
  }
  return props[`${status}Text` as const] || 'test'
}
const showSuccessTip = () => {
  state.status = 'success'

  setTimeout(() => {
    setStatus(0)
  }, +props.successDuration)
}

const checkPosition = (event: TouchEvent) => {
  const el = scrollParent.value
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset
  console.log(top,'top')
  // iOS scroll bounce cause minus scrollTop
  reachTop = Math.max(top, 0) === 0
  // 如果页面元素在顶端，触发下拉刷新动作
  if (reachTop) {
    state.duration = 0
    touch.start(event)
  }
}

const stopPropagation = (event: Event) => event.stopPropagation()

const preventDefault = (event: Event, isStopPropagation?: boolean) => {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}

const onTouchStart = (e: TouchEvent) => {
  // 非loading与success状态检测位置
  if (isTouchable()) {
    // scrollTop是否为0检查，如果为0，防止touchMove上拉触发下拉刷新bug
    checkPosition(e)
  }
}
const onTouchMove = (e: TouchEvent) => {
  // 非loading与success状态检测位置
  if (isTouchable()) {
    // 如果scrollTop不为0触发位置检测
    if (!reachTop) {
      checkPosition(e)
    }

    const { deltaY } = touch
    touch.move(e)
    // move到顶部（即scrollTop为0，并且touch移动位置大于0，且是垂直移动）时，改变下拉刷新位置
    if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
      preventDefault(e)
      setStatus(ease(deltaY.value))
    }
  }
}
const onTouchEnd = (e: TouchEvent) => {
  // 当松开手时，已经在顶部，手指移动值大于0且不是loading与success状态
  if (reachTop && touch.deltaY.value && isTouchable()) {
    state.duration = +props.animationDuration

    if (state.status === 'loosing') {
      setStatus(+props.headHeight, true)
      // 变更v-model值的变量为true
      emit('update:modelValue', true)
      // 触发自定义refresh事件
      nextTick(() => emit('refresh'))
    } else {
      // 否则下拉刷新位置归0
      setStatus(0)
    }
  }
}
watch(
  () => props.modelValue,
  (value) => {
    state.duration = +props.animationDuration

    if (value) {
      setStatus(+props.headHeight, true)
    } else if (props.successText) {
      showSuccessTip()
    } else {
      setStatus(0, false)
    }
  }
)

let cleaned = false
let attached: boolean

const add = (target, type, listener) => {
  if (cleaned) {
    return
  }
  const element = unref(target)

  if (element && !attached) {
    element.addEventListener(type, listener, {
      capture: false,
      passive: false
    })
    attached = true
  }
}

const remove = (target, type, listener) => {
  if (cleaned) {
    return
  }
  const element = unref(target)

  if (element && attached) {
    element.removeEventListener(type, listener, false)
    attached = false
  }
}

onUnmounted(() => remove(track, 'touchmove', onTouchMove))
onDeactivated(() => remove(track, 'touchmove', onTouchMove))
onMounted(() => {
  add(track, 'touchmove', onTouchMove)
})
</script>

<style lang="less" scoped>
:root {
  --van-pull-refresh-head-height: 50px;
  --van-pull-refresh-head-font-size: var(--van-font-size-md);
  --van-pull-refresh-head-text-color: var(--van-text-color-2);
  --van-pull-refresh-loading-icon-size: 16px;
}

.van-pull-refresh {
  overflow: hidden;
  &__track {
    position: relative;
    height: 100%;
    transition-property: transform;
  }

  &__head {
    position: absolute;
    left: 0;
    width: 100%;
    height: var(--van-pull-refresh-head-height);
    overflow: hidden;
    color: var(--van-pull-refresh-head-text-color);
    font-size: var(--van-pull-refresh-head-font-size);
    line-height: var(--van-pull-refresh-head-height);
    text-align: center;
    transform: translateY(-100%);
  }

  &__loading {
    .van-loading__spinner {
      width: var(--van-pull-refresh-loading-icon-size);
      height: var(--van-pull-refresh-loading-icon-size);
    }
  }
}
</style>
