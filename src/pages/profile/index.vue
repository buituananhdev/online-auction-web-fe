<template>
    <div class="mt-5 px-[30px] pb-5 flex flex-col text-[#333333] shadow-md">
        <div class="py-[18px] border-b border-gray-200 flex justify-between">
            <div class="flex flex-col">
                <h1 class="text-lg font-semibold">My Profile</h1>
                <span class="text-sm text-[#555555] mt-[3px]">Manage profile information for account security</span>
            </div>
            <div class="flex items-center">
                <button class="px-5 py-1 h-10 border border-gray-300 bg-[#409EFF] ml-5 text-white hover:bg-[#3A8EE4] text-base font-semibold rounded-md transition-all mr-10" @click="() => {isShowChangePassword = true}">Change Password</button>
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
                    <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="Avatar" height="200" width="200" class="rounded-full" @click="openFileInput">
                    <img v-else src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474090QTs/anh-avatar-vit-ngao-sieu-cute_084403989.jpg" alt="Avatar" height="200" width="200" class="rounded-full" @click="openFileInput">
                </label>
            </div>
        </div>
    </div>
    <el-dialog
        v-model="isShowChangePassword"
        width="600"
        :before-close="handleClose"
        style="border-radius: 16px;"
    >
        <div class="flex flex-col text-sm h-[65%] items-center justify-center rounded-lg gap-5">
            <el-form @submit.prevent="submitChangePassword" ref="passwordRef" :model="changePasswordForm" label-width="auto"  :rules="rules">
                <h1 class="text-3xl flex items-center justify-center mb-10 font-bold">Change Password</h1>
                <div class="flex flex-col mb-5">
                    <span class="pb-[3px]">Old Password</span>
                    <el-form-item prop="oldPass">
                        <el-input size="large" type="password" show-password v-model="changePasswordForm.oldPass" placeholder="Please input your old password" style="width: 400px; padding-left: 20px; color: #333333;"/>
                    </el-form-item>
                </div>
                <div class="flex flex-col mb-5">
                    <span class="pb-[3px]">New Password</span>
                    <el-form-item prop="newPass">
                        <el-input size="large" type="password" show-password v-model="changePasswordForm.newPass" placeholder="Please input your new password" style="width: 400px; padding-left: 20px; color: #333333;"/>
                    </el-form-item>
                </div>
                <div class="flex flex-col mb-10">
                    <span class="pb-[3px]">Confirm Password</span>
                    <el-form-item prop="confirmNewPass">
                        <el-input size="large" type="password" show-password v-model="changePasswordForm.confirmNewPass" placeholder="Please confirm your new password" style="width: 400px; padding-left: 20px; color: #333333;"/>
                    </el-form-item>
                </div>
                <div class="flex pb-8">
                    <button class="px-5 py-2 border border-gray-300 bg-[#409EFF] ml-5 text-white hover:bg-[#3A8EE4] text-base font-semibold rounded-md transition-all" type="submit">Change Password</button>
                    <button class="px-5 py-2 border border-gray-300 ml-5 text-[#E23F33] hover:bg-[#E23F33] hover:text-white text-base font-semibold rounded-md transition-all" @click="() => {isShowChangePassword = false}">Cancel</button>
                </div>
            </el-form>
        </div>
    </el-dialog>
    <!-- <div 
        v-if="isShowChangePassword"
        class="w-full bg-[rgba(17,24,32,0.7)] fixed top-0 bottom-0 left-0 right-0 h-screen z-10 flex items-center justify-center"
    >
        
    </div> -->
</template>

<script setup>
import { reactive, ref } from 'vue'
import { authStore } from '../../stores/auth.store'
import { updateProfile, changePassword } from '../../services/user.service'
 
const form = ref(null)
const passwordRef = ref(null)
const userAuth = authStore()
const isValids = ref([false, false, false])
const isValids2 = ref([false, false, false])
const isShowChangePassword = ref(false)


const currentUser = reactive({
    fullName: userAuth.user.fullName,
    email: userAuth.user.email,
    phone: userAuth.user.phone,
    address: userAuth.user.address,
    avatar: userAuth.user.avatar
})

const changePasswordForm  = reactive({
    oldPass: '',
    newPass: '',
    confirmNewPass: '',
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

const validateField2 = (field, value, errorMessage) => {
    if (!value) {
        return new Error(errorMessage)
    } else if ( field === 1 || field === 2) {
        if (changePasswordForm.newPass != changePasswordForm.confirmNewPass) {
            return new Error('Passwords do not match')
        }
    }
}

const validateOldPass = (rule, value, callback) => {
    const errorMessage = 'Old Password is required'
    const error = validateField2(0, value, errorMessage)
    if (error) callback(error)
    else callback()
}
const validateNewPass = (rule, value, callback) => {
    const errorMessage = 'New Password is required'
    const error = validateField2(1, value, errorMessage)
    if (error) callback(error)
    else callback()
}
const validateConfirmNewPass = (rule, value, callback) => {
    const errorMessage = 'Confirm New Password is required'
    const error = validateField2(2, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const rules = reactive({
    fullName: [{ validator: validateFullName, trigger: 'blur' }],
    phone: [{ validator: validatePhone,  trigger: 'blur' }],
    address: [{ validator: validateAddress, trigger: 'blur' }],
    oldPass: [{ validator: validateOldPass, trigger: 'blur' }],
    newPass: [{ validator: validateNewPass, trigger: 'blur' }],
    confirmNewPass: [{ validator: validateConfirmNewPass, trigger: 'blur' }]
})

const handleClose = () => {
  ElMessageBox.confirm('Are you sure you want to close the password change form?')
    .then(() => {
        isShowChangePassword.value = false
    })
    .catch(() => {
        isShowChangePassword.value = true
    })
}

const submit = () => {
  console.log('submit!')
}

const submitChangePassword = () => {
    console.log('change password!');
}
</script>

<style>
.el-form-item {
    margin-bottom: 0 !important;
}
</style>