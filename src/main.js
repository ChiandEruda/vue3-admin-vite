import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/mock'
import axios from '@/plugins/axios.js'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(ElementPlus)

app.config.globalProperties.axios = axios

app.mount('#app')
