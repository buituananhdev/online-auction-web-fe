<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full rounded-3xl bg-white py-8 shadow-lg">
            <h1 class="text-center text-5xl font-bold text-gray-800 mb-6">Hello</h1>
            <p class="text-center">
                Sign in to NhanCute or
                <a href="/register" class="text-[#3665f3] cursor-pointer underline">create an account</a>
            </p>
            <div class="my-4 flex flex-col justify-center items-center gap-4">
                <el-form
                    ref="userRef"
                    :rules="rules"
                    style="max-width: 600px; margin-bottom: -20px"
                    :model="user"
                    label-width="auto"
                >
                    <el-form-item prop="email">
                        <el-input
                            v-model="user.email"
                            type="email"
                            style="width: 340px"
                            size="large"
                            class="cursor-pointer"
                            placeholder="Please input your email"
                        />
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input
                            v-model="user.password"
                            style="width: 340px"
                            type="password"
                            autocomplete="off"
                            size="large"
                            placeholder="Please input your password"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="large" type="primary" class="w-[340px]" @click="submit(userRef)" round
                            >Sign in</el-button
                        >
                    </el-form-item>
                </el-form>
                <div class="relative">
                    <hr />
                    <div class="absolute z-2 bg-[black] h-[1px] w-[360px] left-[-180px] opacity-20"></div>
                    <span class="absolute bg-white top-[-10px] text-sm px-1">or</span>
                </div>
                <div ref="googleLoginBtn" class="rounded"></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../stores/auth.store'
import { useAuctionStore } from '../../stores/auction.store'
import { loginApi, loginGGApi } from '../../services/auth.service'

const isValids = ref([])
const router = useRouter()
const userRef = ref()
const user = reactive({
    email: '',
    password: '',
})
const useAuction = useAuctionStore()
const googleLoginBtn = ref()
const auth = authStore()
onMounted(() => {
    console.log('hehehehhe', router.path);
    console.log('onBeforeMount')
    const gClientId = '666131485042-hnsv2co3gq2dg5g8hc77e4p1fto5rell.apps.googleusercontent.com'
    window.google.accounts.id.initialize({
        client_id: gClientId,
        scope: 'user profile openid',
        callback: handleCredentialResponse,
        auto_select: true,
    })
    window.google.accounts.id.renderButton(googleLoginBtn.value, { theme: 'outline', size: 'large', width: '340' })
    window.google.accounts.id.prompt()
})
const handleCredentialResponse = async (res) => {
    try {
        console.log('res', res)
        const data = await loginGGApi(res.credential)
        console.log('data hheehh', data.data)
        localStorage.setItem('access_token', data.data.accessToken)
        localStorage.setItem('refresh_token', data.data.refresh_token)
        await auth.initAuthStore()
        await useAuction.initializeConnection(data.data.accessToken)
        ElNotification({
            title: 'Success',
            message: 'Log in successfully!',
            type: 'success',
        })
        router.push('/')
    } catch (error) {
        ElNotification({
            title: 'Error',
            message: 'Login Failed!',
            type: 'error',
        })
        console.log(error)
    }
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

const checkMail = (rule, value, callback) => {
    if (!value) {
        isValids.value[0] = false
        return callback(new Error('Please enter email address!'))
    } else if (!validateEmail(value)) {
        isValids.value[0] = false
        return callback(new Error('Email address is not valid!'))
    }
    isValids.value[0] = true
    callback()
}

const validatePass = (rule, value, callback) => {
    if (value === '' || value === undefined) {
        isValids.value[1] = false
        return callback(new Error('Please input the password'))
    }
    callback()
    isValids.value[1] = true
}

const rules = reactive({
    password: [{ validator: validatePass, trigger: 'blur' }],
    email: [{ validator: checkMail, trigger: 'blur' }],
})

const submit = async (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (!valid) {
            console.log('error submit!')
            return false
        }
        console.log('Not input information.')
    })
    if (isValids.value.includes(false)) {
        ElNotification({
            title: 'Error',
            message: 'Login Failed!',
            type: 'error',
        })
    } else {
        try {
            const data = await loginApi(user)
            console.log('data', data)
            localStorage.setItem('access_token', data.data.accessToken)
            localStorage.setItem('refresh_token', data.data.refreshToken)
            localStorage.setItem('role', data.data.role)
            await auth.initAuthStore()
            await useAuction.initializeConnection(data.data.accessToken)
            router.push({ name: 'dashboard' })
            ElNotification({
                title: 'Success',
                message: 'Log in successfully!',
                type: 'success',
            })
        } catch (error) {
            ElNotification({
                title: 'Error',
                message: 'Login Failed!',
                type: 'error',
            })
            console.log(error)
        }
    }
}
</script>
<style lang="scss" scoped></style>
