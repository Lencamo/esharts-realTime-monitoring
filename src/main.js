import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from 'axios'

// 引入全局样式文件
import '@/assets/css/global.less'
// 引入阿里字体图标
import '@/assets/font/iconfont.css'

// 引入websocket
import SocketService from '@/websocket/service'
SocketService.Instance.serviceConnectFn() // 得到实例对象 SocketService.Instance()
Vue.prototype.$socket = SocketService.Instance

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
