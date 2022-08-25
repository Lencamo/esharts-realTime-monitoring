import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/seller',
    component: () => import('@/views/sellerShow.vue')
  },
  {
    path: '/trend',
    component: () => import('@/views/trendShow.vue')
  },
  {
    path: '/map',
    component: () => import('@/views/mapShow.vue')
  },
  {
    path: '/rank',
    component: () => import('@/views/rankShow.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
