import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    component: () => import('@/views/screenCom.vue')
  }

  // 模块测试部分
  // {
  //   path: '/seller',
  //   component: () => import('@/views/sellerShow.vue')
  // },
  // {
  //   path: '/trend',
  //   component: () => import('@/views/trendShow.vue')
  // },
  // {
  //   path: '/map',
  //   component: () => import('@/views/mapShow.vue')
  // },
  // {
  //   path: '/rank',
  //   component: () => import('@/views/rankShow.vue')
  // },
  // {
  //   path: '/hot',
  //   component: () => import('@/views/hotShow.vue')
  // },
  // {
  //   path: '/stock',
  //   component: () => import('@/views/stockShow.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
