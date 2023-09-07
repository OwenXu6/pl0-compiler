import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'dayjs/locale/zh-cn'
import router from './router/index.js'
import {createPinia} from "pinia";

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(ElementPlus,{
    locale:zhCn
})
app.mount("#app")