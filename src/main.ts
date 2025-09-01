import Toast from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

const options: PluginOptions = {
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
}

app.use(pinia)

app.use(Toast, options)

app.mount('#app')
