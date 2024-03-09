<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full rounded-3xl bg-white py-8 shadow-lg">
            <h1 class="text-center text-5xl font-bold text-gray-800 mb-6">Hello</h1>
            <p class="text-center">Sign in to NhanCute or <a href="/register" class="text-[#3665f3] cursor-pointer underline">create an account</a></p>
            <div class="my-4 flex flex-col justify-center items-center gap-4">
                <el-input v-model="email" style="width: 340px" size="large" class="cursor-pointer" placeholder="Please input your email" />
                <el-input
                    v-model="password"
                    style="width: 340px"
                    type="password"
                    size="large"
                    placeholder="Please input your password"
                    show-password
                />
                <el-button size="large" color="#3665f3" class="w-[340px]" @click="submit" round>Log in</el-button>
                <div class="relative">
                    <hr/>
                    <div class="absolute z-2 bg-[black] h-[1px] w-[360px] left-[-180px] opacity-20"></div>
                    <span class="absolute bg-white top-[-10px] text-sm">or</span>
                </div>
                <div class="button-google relative">
                    <img src="../../assets/images/google.png" class="absolute top-2.5 left-4" width="20" alt="">
                    <el-button size="large" class="w-[340px]" round>Log in with Google </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/stores/auth.store'
import { loginApi, loginGGApi } from '@/services/auth.service'

const formInline = reactive({
    user: '',
    region: '',
    date: '',
})

const onSubmit = () => {
    console.log('submit!')
}
const router = useRouter()
const email = ref('')
const password = ref('')
const googleLoginBtn = ref()
const auth = authStore()
onMounted(() => {
    console.log('onBeforeMount')
    // const gClientId = '539910609167-67i01tcoja47s71qshaeodhcc69d5u99.apps.googleusercontent.com'
    // window.google.accounts.id.initialize({
    //     client_id: gClientId,
    //     scope: 'user profile openid',
    //     callback: handleCredentialResponse,
    //     auto_select: true,
    // })
    // window.google.accounts.id.renderButton(googleLoginBtn.value, { theme: 'outline', size: 'large', width: '400' })
    // window.google.accounts.id.prompt()
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
    } catch (error) {}
}
const submit = async () => {
    try {
        const data = await loginApi({ email: email.value, password: password.value })
        // .then((res) => {
            // data = res.data.data
            console.log('data', data)
            console.log(data.data.accessToken);
            localStorage.setItem('access_token', data.data.accessToken)
            localStorage.setItem('refresh_token', data.data.refreshToken)
        // }))
        await auth.initAuthStore()
        router.push({ name: 'dashboard' })
    } catch (error) {
        console.log(error)
    }
}
</script>
<style lang="scss" scoped>

</style>
