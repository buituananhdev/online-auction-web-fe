import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHistory } from 'vue-router'

const getLayout = () => {
    let res;
    const token = localStorage.getItem('access_token')
    res = token ? {
        layout: 'auth',
        requiresAuth: true
    } :  {
        layout: 'default'
    } 
    return res
}

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../pages/dashboard/index.vue'),
        // meta: { layout: , requiresAuth: true },
        meta: getLayout(),
    },
    {
        path: '/auctions',
        name: 'list-auctions',
        component: () => import('../pages/auctions/index.vue'),
        // meta: { layout: 'auth', requiresAuth: true },
        meta: getLayout(),
        children: [],
    },
    {
        path: '/create-auction',
        name: 'create-auction',
        component: () => import('../pages/auctions/create/index.vue'),
        meta: { layout: 'activity', requiresAuth: true, sellerPermission: true },
    },
    {
        path: '/seller-history',
        name: 'seller-history',
        component: () => import('../pages/history/seller/index.vue'),
        meta: { layout: 'activity', requiresAuth: true, sellerPermission: true },
    },
    {
        path: '/revenue',
        name: 'revenue',
        component: () => import('../pages/revenue/index.vue'),
        meta: { layout: 'activity', requiresAuth: true, sellerPermission: true },
    },
    {
        path: '/watchlist',
        name: 'watchlist',
        component: () => import('../pages/watchlist/index.vue'),
        meta: { layout: 'activity', requiresAuth: true },
    },
    {
        path: '/profile/:id',
        name: 'profile',
        component: () => import('../pages/profile/[id].vue'),
        meta: { layout: 'activity', requiresAuth: true },
    },
    {
        path: '/buyer-history',
        name: 'buyer-history',
        component: () => import('../pages/history/buyer/index.vue'),
        meta: { layout: 'activity', requiresAuth: true },
    },
    // Auth router
    {
        path: '/login',
        name: 'login',
        meta: { layout: 'empty' },
        component: () => import('../pages/auth/loginPage.vue'),
    },
    {
        path: '/test',
        name: 'test',
        meta: { layout: 'default' },
        component: () => import('../pages/auctions/test.vue'),
    },
    {
        path: '/register',
        name: 'register',
        meta: { layout: 'empty' },
        component: () => import('../pages/auth/registerPage.vue'),
    },
    {
        path: '/auctions/:id',
        name: 'singleAuction',
        meta: getLayout(),
        component: () => import('../pages/auctions/[id].vue'),
    },
    // Payments route
    {
        path: '/payments/:id',
        name: 'payments',
        meta: { layout: 'auth', requiresAuth: true },
        component: () => import('../pages/payments/[id].vue'),
    },
    {
        path: '/payment-result',
        name: 'payment-result',
        meta: { layout: 'auth', requiresAuth: true },
        component: () => import('../pages/payments/paymentResult/index.vue'),
    },
    {
        path: '/seller/:id',
        name: 'seller-infomation',
        meta: { layout: 'auth', requiresAuth: true },
        component: () => import('../pages/profile/seller/[id].vue'),
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
