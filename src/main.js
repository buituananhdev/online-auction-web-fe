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
import activityLayout from './layouts/activityLayout.vue'
import ProductCard from './components/Product/ProductCard.vue'
import FilterProduct from './components/Product/FilterProduct.vue'
import SkeletonCard from './components/Product/SkeletonCard.vue'
import CategoryCard from './components/Category/CategoryCard.vue'
import HistoryCard from './components/Product/HistoryCard.vue'
import HistoryProductList from './components/Product/HistoryProduct/HistoryProductList.vue'
import WatchlistCard from './components/product/WatchlistCard.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { Icon } from '@iconify/vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const initApp = async () => {
    authMiddleware()
    const app = createApp(App)
    app.use(pinia)
    const auth = authStore()
    await auth.initAuthStore()
    app.use(router)
    app.component('auth-layout', authLayout)
    app.component('empty-layout', emptyLayout)
    app.component('activity-layout', activityLayout)
    app.component('product-card', ProductCard)
    app.component('skeleton-card', SkeletonCard)
    app.component('filter-product', FilterProduct)
    app.component('category-card', CategoryCard)
    app.component('VueDatePicker', VueDatePicker)
    app.component('Icon', Icon)
    app.component('history-card', HistoryCard)
    app.component('history-product-list', HistoryProductList)
    app.component('watchlist-card', WatchlistCard)
    app.component('QuillEditor', QuillEditor)
    app.mount('#app')
}
initApp()