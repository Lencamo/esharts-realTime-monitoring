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
  }
]

const router = new VueRouter({
  routes
})

export default router
