import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
    },
    {
      path: '/login',
      component: Login,
    },
  ],
  // 路由行为配置项：每次切换路由回到页面顶部
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

export default router
