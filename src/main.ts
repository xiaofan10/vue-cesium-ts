import './assets/main.less'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/components/mars-ui/common'
import InstallUI from '@/components/mars-ui/index'
import * as Cesium from 'cesium'
import Material from '@/lib/cesium/material/index'
import './plugins/index'

const app = createApp(App)
console.log(import.meta.env.VITE_ENV)
window.Cesium = Cesium

InstallUI(app)
new Material(Cesium)

app.use(createPinia())
app.use(router)

app.mount('#app')
