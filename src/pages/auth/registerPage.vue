<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full rounded-3xl bg-white py-8 shadow-lg">
            <h1 class="text-center text-2xl font-bold text-gray-800 mb-6">Create an account</h1>
            <div class="my-3 flex items-center text-sm gap-20 w-full justify-center">
                <label class="flex items-center gap-2">
                    <input
                        validate-event="true"
                        type="radio"
                        :value="options[0]"
                        v-model="user.role"
                        name="radio"
                        checked
                    />
                    <b>Buyer account</b>
                </label>
                <label class="flex items-center gap-2">
                    <input validate-event="true" type="radio" :value="options[1]" v-model="user.role" name="radio" />
                    <b>Seller account</b>
                </label>
            </div>
            <div class="my-4 flex flex-col justify-center items-center gap-6">
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
                    <el-form-item prop="confirmPassword">
                        <el-input
                            v-model="user.confirmPassword"
                            style="width: 340px"
                            type="password"
                            size="large"
                            placeholder="Please confirm your password"
                            show-password
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button size="large" class="w-[340px]" type="primary" @click="submit(userRef)" round
                            >Create an account</el-button
                        >
                    </el-form-item>
                </el-form>
                <div class="relative">
                    <hr />
                    <div class="absolute z-2 bg-[black] h-[1px] w-[360px] left-[-180px] opacity-20"></div>
                    <span class="absolute bg-white top-[-10px] text-sm px-1">or</span>
                </div>
                <div class="button-google relative">
                    <img src="../../assets/images/google.png" class="absolute top-2.5 left-4" width="20" alt="" />
                    <el-button size="large" class="w-[340px]" round>Log in with Google </el-button>
                </div>
                <p class="text-center text-sm text-[gray]">
                    Already have an account? <a href="/login" class="text-[#409EFF] cursor-pointer underline">Log in</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { registerApi } from '../../services/auth.service'
// import { ElNotification } from 'element-plus'

const router = useRouter()
const user = reactive({
    role: 1,
    password: '',
    confirmPassword: '',
    email: '',
})
const userRef = ref()
const options = ref([1, 2])
const isValids = ref([])
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
        callback(new Error('Please input the password'))
    } else {
        if (user.confirmPassword !== '') {
            if (!userRef.value) return
            userRef.value.validateField('confirmPassword', () => null)
        }
        callback()
        isValids.value[1] = true
    }
}
const validatePass2 = (rule, value, callback) => {
    if (value === '' || value === undefined) {
        isValids.value[2] = false
        callback(new Error('Please input the password again'))
    } else if (value !== user.password) {
        isValids.value[2] = false
        callback(new Error("Two inputs don't match!"))
    } else {
        isValids.value[2] = true
        callback()
    }
}

const rules = reactive({
    password: [{ validator: validatePass, trigger: 'blur' }],
    confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
    email: [{ validator: checkMail, trigger: 'blur' }],
})

function checkValidSubmit(user) {
    for (let key in user) {
        if (user[key] === null) {
            return 0;
        }
    }
    if(user.password !== user.confirmPassword) return 1
    return 2;
}

const submit = async (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
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
            if(checkValidSubmit(user) !== 2) {
                if(checkValidSubmit(user) === 1)
                    ElNotification({
                        title: 'Error',
                        message: 'Password and confirm password do not match!',
                        type: 'error',
                    })
                else 
                    ElNotification({
                        title: 'Error',
                        message: 'Please input all information!',
                        type: 'error',
                    })
                return
            }
            await registerApi(user)
            router.push({ name: 'login' })
            localStorage.setItem('isAuthPage', true)
            ElNotification({
                title: 'Success',
                message: 'Log in successfully!',
                type: 'success',
            })
        } catch (error) {
            if(error.response.data.error === 'Email already exists!') {
                ElNotification({
                    title: 'Error',
                    message: 'Email already exists!',
                    type: 'error',
                })
            } else 
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
