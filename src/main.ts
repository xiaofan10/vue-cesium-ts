import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import '@/components/mars-ui/mars-ui/common'
import InstallUI from '@/components/mars-ui/index'

const app = createApp(App)

InstallUI(app)

// app.use(createPinia())
app.use(router)

app.mount('#app')
