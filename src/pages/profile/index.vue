<template>
    <div class="mt-5 px-[30px] pb-5 flex flex-col text-[#333333] shadow-md">
        <div class="py-[18px] border-b border-gray-200 flex justify-between">
            <div class="flex flex-col">
                <h1 class="text-lg font-semibold">My Profile</h1>
                <span class="text-sm text-[#555555] mt-[3px]">Manage profile information for account security</span>
            </div>
            <div class="flex items-center">
                <button class="px-5 py-1 h-10 border border-gray-300 bg-[#409EFF] ml-5 text-white hover:bg-[#3A8EE4] text-base font-semibold rounded-md transition-all mr-10">Change Password</button>
            </div>
        </div>
        <div class="flex pt-[30px] font-normal">
            <div class="flex flex-col text-sm pr-[50px] flex-1 border-r border-gray-200">
                <el-form @submit.prevent="submit" ref="form" :model="currentUser" label-width="auto"  :rules="rules">
                    <div class="pb-[30px] flex">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Email</span>
                        <span class="pl-5 text-[#333333]">{{ currentUser.email }}</span>
                    </div>
                    <div class="pb-[30px] flex items-center">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Full Name</span>
                        <el-form-item prop="fullName">
                            <el-input size="large" v-model="currentUser.fullName" style="width: 400px; padding-left: 20px; color: #333333;"/>
                        </el-form-item>
                    </div>
                    <div class="pb-[30px] flex items-center">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Phone Number</span>
                        <el-form-item prop="phone">
                            <el-input size="large" v-model="currentUser.phone" style="padding-left: 20px; color: #333333; width: 400px;" />
                        </el-form-item>
                    </div>
                    <div class="pb-[30px] flex items-center">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Address</span>
                        <el-form-item prop="address">
                            <el-input size="large" v-model="currentUser.address" style="padding-left: 20px; color: #333333; width: 400px;" />
                        </el-form-item>
                    </div>
                    <div class="pb-[30px] flex">
                        <span class=" min-w-[30%] text-right"></span>
                        <button class="px-5 py-2 border border-gray-300 bg-[#409EFF] ml-5 text-white hover:bg-[#3A8EE4] text-base font-semibold rounded-md transition-all" type="submit">Save</button>
                    </div>
                </el-form>
            </div>
            <div class="min-w-[30%] flex items-center justify-center">
                <label class="cursor-pointer">
                    <input type="file" hidden ref="fileInput">
                    <img src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474090QTs/anh-avatar-vit-ngao-sieu-cute_084403989.jpg" alt="Avatar" height="200" width="200" class="rounded-full" @click="openFileInput">
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { authStore } from '../../stores/auth.store'

const form = ref(null)
const userAuth = authStore()
const isValids = ref([false, false, false])


const currentUser = reactive({
    fullName: userAuth.user.fullName,
    email: userAuth.user.email,
    phone: userAuth.user.phone,
    address: userAuth.user.address,
})



const avatar = reactive('')

const validateField = (field, value, errorMessage) => {
    if (!value) {
        isValids.value[field] = false
        return new Error(errorMessage)
    }
    isValids.value[field] = true
}
const validateFullName = (rule, value, callback) => {
    const errorMessage = 'Full Name is required'
    const error = validateField(0, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const validatePhone = (rule, value, callback) => {
    const errorMessage = 'Phone Number is required'
    const error = validateField(1, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const validateAddress = (rule, value, callback) => {
    const errorMessage = 'Address is required'
    const error = validateField(2, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const rules = reactive({
    fullName: [{ validator: validateFullName, trigger: 'blur' }],
    phone: [{ validator: validatePhone,  trigger: 'blur' }],
    address: [{ validator: validateAddress, trigger: 'blur' }],
})
const submit = () => {
  console.log('submit!')
}
</script>

<style>
.el-form-item {
    margin-bottom: 0 !important;
}
</style>