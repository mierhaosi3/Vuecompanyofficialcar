import { createApp } from 'vue'
import { store } from './store';
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'
import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App)

app.use(ElementPlus, { locale })
app.use(router)
app.use(store)

app.use(VueAxios,axios)
axios.defaults.baseURL = 'http://localhost:8081'

app.mount('#app')
