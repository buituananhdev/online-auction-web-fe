import { defineStore } from 'pinia'
import { getMe } from '../services/user.service';

export const authStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        user: null, // Add a user property to your state
    }),
    getters: {
        roleUser: (state) => state.user.role,
    },
    actions: {
        async initAuthStore() {
            if (localStorage.getItem('access_token')) {
                const { data } = await getMe()
                this.user = data; // Assuming 'data' contains user information
                this.isLoggedIn = true;
                console.log('initAuthStore', this.$state);
            }
        },
    },
})
