<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full rounded-3xl bg-white py-8 shadow-lg">
            <h1 class="text-center text-2xl font-bold text-gray-800 mb-6">Create an account</h1>
            <p class="text-center"> Already have an account? <a href="/login" class="text-[#3665f3] cursor-pointer underline">Log in</a></p>
            <div class="my-4 flex flex-col justify-center items-center gap-4">
                <el-input v-model="user.fullName" style="width: 340px" size="large" class="cursor-pointer" placeholder="Please input your fullname" />
                <el-input v-model="user.email" type="email" style="width: 340px" size="large" class="cursor-pointer" placeholder="Please input your email" />
                <el-select
                    v-model="user.role"
                    placeholder="Please select your role"
                    size="large"
                    style="width: 340px"
                    >
                    <el-option
                        v-for="item in options"
                        :key="item"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                <el-input
                    v-model="user.password"
                    style="width: 340px"
                    type="password"
                    size="large"
                    placeholder="Please input your password"
                    show-password
                />
                <el-input
                    v-model="confirmPassword"
                    style="width: 340px"
                    type="password"
                    size="large"
                    placeholder="Please confirm your password"
                    show-password
                />
                <el-button size="large" color="#3665f3" class="w-[340px]"  @click="submit" round>Create account</el-button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registerApi } from '@/services/auth.service'

const router = useRouter()
const user = ref({});
const confirmPassword = ref('')
const options = ref([
    {
        label: "Buyer",
        value: 1
    },
    {
        label: "Seller",
        value: 2
    },
])
const submit = async () => {
    try {
        await registerApi(user.value).then((res) => {
            const data = res.data.data
        })
        router.push({ name: 'login' })
    } catch (error) {
        console.error(error)
    }
}
</script>

<style lang="scss" scoped></style>
