import router from '.'
import { authStore } from '../stores/auth.store'
export const authMiddleware = () => {
    router.beforeEach((to, from, next) => {
        console.log('beforeEach aa', to, from)
        const isLoggedIn = localStorage.getItem('access_token')
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            console.log('!isLoggedIn ', !isLoggedIn)
            if (!isLoggedIn) {
                next({ name: 'login' })
                localStorage.setItem('isAuthPage', true)
            } else {
                if (to.matched.some((record) => record.meta.sellerPermission)) {
                    if (authStore().roleUser !== 2) {
                        next({ name: 'dashboard' })
                    } else {
                        next()
                    }
                }
                next()
            }
        } else {
            if (isLoggedIn && to.name == 'login') {
                next({ name: 'dashboard' })
            } else {
                next()
            }
        }
    })
}
