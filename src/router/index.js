import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Layout from '@/views/Layout/index.vue'
import Facility from '@/views/Facility/index.vue'
import Nursing from '@/views/Nursing/index.vue'
import NursingQuery from '@/views/NursingQuery/index.vue'
import Activity from '@/views/Activity/index.vue'
import Health from '@/views/Health/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    // 主页概述
    {
      path: '/screen',
      component: Layout,
    },
    // 养老设施
    {
      path: '/facility',
      component: Facility,
    },
    // 护工信息可视化
    {
      path: '/nursing',
      component: Nursing
    },
    // 护工查询
    {
      path: '/nursing/query',
      component: NursingQuery
    },
    // 社区活动
    {
      path: '/activity',
      component: Activity,
    },
    // 健康档案
    {
      path: '/health',
      component: Health,
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
