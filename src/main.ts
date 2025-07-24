import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { usePlantmonStore } from './store/plantmon'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// 初始化模拟数据
const plantmonStore = usePlantmonStore()
plantmonStore.initMockData()
