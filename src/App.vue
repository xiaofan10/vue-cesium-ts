<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
const visible = ref<Boolean>(false)
setTimeout(() => {
  visible.value = true
}, 3000)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
