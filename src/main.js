import { createApp } from 'vue'
// import Vue from 'vue'
import router from '@/router'
import { pinia } from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './assets/css/tailwind.css'
import './assets/css/font.css'
import { authStore } from '@/stores/auth.store'
import { authMiddleware } from '@/router/router.middleware'
import authLayout from '@/layouts/authLayout.vue'
import emptyLayout from '@/layouts/emptyLayout.vue'
import ProductCard from '@/components/card/ProductCard.vue'

// const 

const initApp = async () => {
    authMiddleware()
    const app = createApp(App)
    app.use(pinia)
    const auth = authStore()
    await auth.initAuthStore()
    app.use(router)
    app.component('auth-layout', authLayout)
    app.component('empty-layout', emptyLayout)
    app.component('product-card', ProductCard)
    app.use(ElementPlus)
    app.mount('#app')
}
initApp()
