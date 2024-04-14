import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../pages/dashboard/index.vue'),
        meta: { layout: 'auth', requiresAuth: true },
    },
    {
        path: '/auctions',
        name: 'list-auctions',
        component: () => import('../pages/auctions/index.vue'),
        meta: { layout: 'auth', requiresAuth: true },
    },
    {
        path: '/seller-history',
        name: 'seller-history',
        component: () => import('../pages/history/SellerHistory.vue'),
        meta: { layout: 'auth', requiresAuth: true },
    },
    // Auth router
    {
        path: '/login',
        name: 'login',
        meta: { layout: 'empty' },
        component: () => import('../pages/auth/loginPage.vue'),
    },
    {
        path: '/register',
        name: 'register',
        meta: { layout: 'empty' },
        component: () => import('../pages/auth/registerPage.vue'),
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
