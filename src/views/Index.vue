<script setup lang="ts">
import { ref } from 'vue'
import Refresh from './Compo/Refresh/index.vue'
const isLoading = ref(false)

const onChange = (e) => {
  console.log(e, 'refresh change')
}
const onRefresh = () => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
}
</script>

<template>
  <div class="container">
    <Refresh v-model="isLoading" @change="onChange" @refresh="onRefresh" success-text="刷新成功">
      <div>下拉拖动刷新吧</div>
    </Refresh>
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
