import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入全局less
import './assets/css/global.less'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
