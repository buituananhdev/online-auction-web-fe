import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import './assets/css/tailwind.css'
import vue3GoogleLogin from 'vue3-google-login'
import { authStore } from './stores/auth.store'
import { authMiddleware } from './router/router.middleware'
import authLayout from './layouts/authLayout.vue'
import emptyLayout from './layouts/emptyLayout.vue'


const initApp = async () => {
    authMiddleware()
    const app = createApp(App)
    app.use(pinia)
    const auth = authStore()
    await auth.initAuthStore()
    app.use(router)
    app.component('auth-layout', authLayout)
    app.component('empty-layout', emptyLayout)
    // app.component('product-card', ProductCard)
    // app.use(ElementPlus)
    app.use(vue3GoogleLogin, {
        clientId: '666131485042-hnsv2co3gq2dg5g8hc77e4p1fto5rell.apps.googleusercontent.com',
    })
    app.mount('#app')
}
initApp()