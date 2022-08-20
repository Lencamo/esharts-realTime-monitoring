import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'

// 全局配置axios的请求🌈根路径
axios.defaults.baseURL = 'http://127.0.0.1:3000'
Vue.prototype.$http = axios

// 将echarts对象全局挂载到vue原型对象上
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
