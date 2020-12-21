import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

// 引入该模块
import axios from 'axios'

// 设置axios拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 将其挂载到原型对象上，这样每个Vue组件都可以通过this访问到$http，从而发起ajax请求
Vue.prototype.$http = axios

// 配置请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')