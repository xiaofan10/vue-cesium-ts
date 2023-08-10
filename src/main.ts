import './assets/main.less'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/components/mars-ui/common'
import InstallUI from '@/components/mars-ui/index'
import * as Cesium from 'cesium'
import Material from '@/lib/cesium/material/index'

const app = createApp(App)

InstallUI(app)
new Material(Cesium)

app.provide('Cesium', Cesium)

app.use(createPinia())
app.use(router)

app.mount('#app')
