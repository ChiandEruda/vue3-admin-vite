import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './mock'
import axios from './plugins/axios.js'

import './assets/base.css'

const app = createApp(App)

app.use(router)

app.use(store)

app.use(ElementPlus, {locale: zhCn})

app.config.globalProperties.axios = axios

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
