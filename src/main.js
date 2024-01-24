import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入全局less
import './assets/css/global.less'

// 引入iconfont
import './assets/font/iconfont.css'

import 'element-plus/dist/index.css'

import 'leaflet/dist/leaflet.css'
// 引入Leaflet对象 挂载到Vue上，便于全局使用，也可以单独页面中单独引用
import * as L from 'leaflet'
import 'leaflet.pm'
import 'leaflet.pm/dist/leaflet.pm.css'
import 'leaflet.heat';

const app = createApp(App)

app.L = L

app.use(createPinia())
app.use(router)

app.mount('#app')
