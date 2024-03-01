<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full">
            <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">Sign in to your dashboard</h2>
            <form class="space-y-4" @submit.prevent="submit">
                <div class="relative text-gray-400">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </span>
                    <input
                        id="user"
                        v-model="username"
                        name="user"
                        type="user"
                        autocomplete="user"
                        class="w-full py-4 text-sm text-gray-900 rounded-md pl-10 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                        placeholder="Username"
                        required=""
                    />
                </div>
                <div class="relative text-gray-400">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </span>
                    <input
                        id="password"
                        v-model="password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        required=""
                        class="w-full py-4 text-sm text-gray-900 rounded-md pl-10 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                        placeholder="Password"
                    />
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-0 border-gray-300 rounded cursor-pointer"
                        />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer">
                            Remember me
                        </label>
                    </div>
                    <div class="text-sm">
                        <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-4 px-6 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Đăng nhập
                    </button>
                </div>
            </form>
            <div class="mt-2 text-sm text-gray-600">
                Chưa có tài khoản?
                <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500">Tạo tài khoản</a>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/stores/auth.store'
import { loginApi, loginGGApi } from '@/services/auth.service'
import { useNotification } from '@kyvg/vue3-notification'
const notification = useNotification()
const router = useRouter()
const username = ref('')
const password = ref('')
const googleLoginBtn = ref()
const auth = authStore();
onMounted(() => {
    console.log('onBeforeMount')
    const gClientId = '539910609167-67i01tcoja47s71qshaeodhcc69d5u99.apps.googleusercontent.com'
    window.google.accounts.id.initialize({
        client_id: gClientId,
        scope: 'user profile openid',
        callback: handleCredentialResponse,
        auto_select: true,
    })
    window.google.accounts.id.renderButton(googleLoginBtn.value, { theme: 'outline', size: 'large', width: '400' })
    window.google.accounts.id.prompt()
})
const handleCredentialResponse = async (res) => {
    try {
        await loginGGApi({ credential: res.credential }).then((res) => {
            const data = res.data
            console.log('data', res.data)
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
        })
        await auth.initAuthStore()
        router.push('/')
    } catch (error) {
        notification.notify({
            type: 'error',
            title: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập',
            text: error.response.data.message,
        })
    }
}
const submit = async () => {
    try {
        await loginApi({ username: username.value, password: password.value }).then((res) => {
            const data = res.data.data
            console.log('data', data)
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
        })
        await initAuthStore()
        router.push({ name: 'users' })
    } catch (error) {
        notification.notify({
            type: 'error',
            title: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập',
            text: 'hihiii',
        })
        console.log(error)
    }
}
</script>
<style lang="scss" scoped></style>
