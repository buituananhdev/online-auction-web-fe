import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../pages/dashboard/index.vue'),
        // meta: { layout: 'auth', requiresAuth: true },
        meta: { layout: 'empty' },
    },
    {
        path: '/auctions',
        name: 'list-auctions',
        component: () => import('../pages/auctions/index.vue'),
        // meta: { layout: 'auth', requiresAuth: true },
        meta: { layout: 'empty' },
        children: []
    },
    {
        path: '/create-auction',
        name: 'create-auction',
        component: () => import('../pages/auctions/createAuction.vue'),
        meta: { layout: 'auth', requiresAuth: true },
    },
    {
        path: '/seller-history',
        name: 'seller-history',
        component: () => import('../pages/history/sellerHistory.vue'),
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
    {
        path: '/auctions/:id',
        name: 'singleAuction',
        meta: { layout: 'auth', requiresAuth: true },
        component: () => import('../pages/auctions/[id].vue'),
    },
]
const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
