import router from '.'
export const authMiddleware = () => {
    router.beforeEach((to, from, next) => {
        console.log('beforeEach aa', to, from)
        const isLoggedIn = localStorage.getItem('access_token')
        if (to.matched.some((record) => record.meta.requiresAuth)) {
            if (!isLoggedIn) {
                next({ name: 'login' })
            } else {
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
