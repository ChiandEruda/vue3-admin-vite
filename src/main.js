import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css';
import './mock'
import axios from './plugins/axios.js'

import './assets/base.css'

const app = createApp(App)

app.use(router)

app.use(store)

app.use(ElementPlus)

app.config.globalProperties.axios = axios

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.mount('#app')
