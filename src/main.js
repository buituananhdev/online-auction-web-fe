import { createApp } from 'vue'
// import Vue from 'vue'
import router from '@/router'
import { pinia } from './stores'
import App from './App.vue'
import './assets/css/tailwind.css'
import './assets/css/font.css'
import '@vuepic/vue-datepicker/dist/main.css'
import Notifications from '@kyvg/vue3-notification'
import { authStore } from '@/stores/auth.store'
import { authMiddleware } from '@/router/router.middleware'
import VueDatePicker from '@vuepic/vue-datepicker'
import authLayout from '@/layouts/authLayout.vue'
import emptyLayout from '@/layouts/emptyLayout.vue'

const initApp = async () => {
    authMiddleware()
    const app = createApp(App)
    app.use(pinia)
    const auth = authStore()
    await auth.initAuthStore()
    app.use(router)
    app.component('auth-layout', authLayout)
    app.component('empty-layout', emptyLayout)
    app.component('vue-date-picker', VueDatePicker)
    app.use(Notifications)
    app.mount('#app')
}
initApp()
