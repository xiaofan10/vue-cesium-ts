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
  const pullDistance = +(props.pullDistance || props.headHeight)
  if (distance > pullDistance) {
    if (distance < pullDistance * 2) {
      distance = pullDistance + (distance - pullDistance) / 2
    } else {
      distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
    }
  }

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
const getScrollTop = (el: ScrollElement): number => {
  const top = 'scrollTop' in el ? el.scrollTop : el.pageYOffset

  // iOS scroll bounce cause minus scrollTop
  return Math.max(top, 0)
}
const checkPosition = (event: TouchEvent) => {
  reachTop = getScrollTop(scrollParent.value!) === 0
  console.log(reachTop, 'reachTop')
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
  if (isTouchable()) {
    checkPosition(e)
  }
}
const onTouchMove = (e: TouchEvent) => {
  if (isTouchable()) {
    if (!reachTop) {
      checkPosition(e)
    }

    const { deltaY } = touch
    touch.move(e)

    if (reachTop && deltaY.value >= 0 && touch.isVertical()) {
      preventDefault(e)
      setStatus(ease(deltaY.value))
    }
  }
}
const onTouchEnd = (e: TouchEvent) => {
  if (reachTop && touch.deltaY.value && isTouchable()) {
    state.duration = +props.animationDuration

    if (state.status === 'loosing') {
      setStatus(+props.headHeight, true)
      emit('update:modelValue', true)

      nextTick(() => emit('refresh'))
    } else {
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
      capture:false,
      passive:false
    })
    attached = true
  }
}

const remove = (target,type,listener) => {
  if (cleaned) {
    return
  }
  const element = unref(target)

  if (element && attached) {
    element.removeEventListener(type, listener, false)
    attached = false
  }
}

onUnmounted(() => remove(track,'touchmove', onTouchMove))
onDeactivated(() => remove(track,'touchmove', onTouchMove))
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
  height: calc(100vh - 50px);

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
