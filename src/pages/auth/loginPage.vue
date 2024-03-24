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
                        <el-button size="large" color="#3665f3" class="w-[340px]" @click="submit(userRef)" round
                            >Sign in</el-button
                        >
                    </el-form-item>
                </el-form>
                <div class="relative">
                    <hr />
                    <div class="absolute z-2 bg-[black] h-[1px] w-[360px] left-[-180px] opacity-20"></div>
                    <span class="absolute bg-white top-[-10px] text-sm px-1">or</span>
                </div>
                <GoogleLogin :callback="callback" prompt class="button-google relative">
                    <img src="../../assets/images/google.png" class="absolute top-2.5 left-4" width="20" alt="" />
                    <el-button size="large" class="w-[340px]" round>Log in with Google </el-button>
                </GoogleLogin>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../stores/auth.store'
import { loginApi, loginGGApi } from '../../services/auth.service'
import { ElNotification } from 'element-plus'

const isValids = ref([])
const router = useRouter()
const userRef = ref()
const user = reactive({
    email: '',
    password: '',
})

const callback = (res) => {
    console.log('logged in')
    console.log(res)
}
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
    } catch (error) {
        console.log(error)
    }
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const checkMail = (rule, value, callback) => {
    if (!value) {
        isValids.value[0] = false;
        return callback(new Error('Please enter email address!'));
    } else if (!validateEmail(value)) {
        isValids.value[0] = false;
        return callback(new Error('Email address is not valid!'));
    }
    isValids.value[0] = true;
    callback();
};

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
        if(!valid) {
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
            await auth.initAuthStore()
            router.push({ name: 'dashboard' })
            console.log()
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
