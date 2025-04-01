import { createSSRApp } from 'vue'
import App from './App.vue'
import store from './store'
import { routeInterceptor, requestInterceptor, prototypeInterceptor } from './interceptors'
import 'virtual:uno.css'
import '@/style/index.scss'
import MyImg from '@/components/img/MyImg.vue'
import CommonButton from '@/components/commonButton/index.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.component('MyImg', MyImg)
  app.component('CommonButton', CommonButton)
  app.use(store)
  app.use(routeInterceptor)
  app.use(requestInterceptor)
  app.use(prototypeInterceptor)
  return {
    app,
  }
}
