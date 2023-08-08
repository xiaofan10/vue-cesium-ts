import './assets/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/components/mars-ui/mars-ui/common'
import InstallUI from '@/components/mars-ui/index'
import * as Cesium from 'cesium'

const app = createApp(App)

InstallUI(app)

app.provide('Cesium', Cesium)

app.use(createPinia())
app.use(router)

app.mount('#app')
