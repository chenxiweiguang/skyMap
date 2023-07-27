import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

import 'element-plus/theme-chalk/index.css'
import ElementPlus from 'element-plus'

const app = createApp(App)
app.use(ElementPlus);
app.mount('#app')