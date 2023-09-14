<script setup lang="ts">
import { RouterView } from 'vue-router'
import Menu from '@/components/business/menu/index.vue'
import { routes } from './router'
</script>

<template>
  <div>
    <Menu :data="routes"></Menu>
  </div>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped lang="less">
@aside-width: 60px;
.main {
  position: relative;
  box-sizing: border-box;
  margin-left: @aside-width;
  width: calc(100% - @aside-width);
  height: 100%;
}
</style>
