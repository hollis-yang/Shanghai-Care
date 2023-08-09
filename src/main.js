import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "@arcgis/core/assets/esri/themes/dark/main.css"

import App from './App.vue'
import router from './router'

// 引入全局less
import './assets/css/global.less'

// 引入iconfont
import './assets/font/iconfont.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')