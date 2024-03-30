import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { pinia } from './stores'
import './assets/scss/tailwind.scss'
import './assets/scss/global.scss'
import { authStore } from './stores/auth.store'
import { authMiddleware } from './router/router.middleware'
import authLayout from './layouts/authLayout.vue'
import emptyLayout from './layouts/emptyLayout.vue'
import ProductCard from './components/product/ProductCard.vue'
import FilterProduct from './components/product/FilterProduct.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

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
    app.component('filter-product', FilterProduct)
    app.component('VueDatePicker', VueDatePicker)
    app.mount('#app')
}
initApp()