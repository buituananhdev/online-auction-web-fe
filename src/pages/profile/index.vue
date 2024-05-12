<template>
    <div class="mt-5 px-[30px] pb-5 flex flex-col text-[#333333] shadow-md">
        <div class="py-[18px] border-b border-gray-200 flex justify-between">
            <div class="flex flex-col">
                <h1 class="text-lg font-semibold">My Profile</h1>
                <span class="text-sm text-[#555555] mt-[3px]">Manage profile information for account security</span>
            </div>
            <div class="flex items-center">
                <button
                    class="px-5 py-1 h-10 border border-gray-300 bg-[#409EFF] ml-5 text-white hover:bg-[#3A8EE4] text-base font-semibold rounded-md transition-all mr-10"
                    @click="() => { isShowChangePassword = true }">Change Password</button>
            </div>
        </div>
        <div class="flex pt-[30px] font-normal">
            <div class="flex flex-col text-sm pr-[50px] flex-1 border-r border-gray-200">
                <el-form @submit.prevent="submit" ref="form" :model="currentUser" label-width="auto" :rules="rules">
                    <div class="pb-[30px] flex">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Email</span>
                        <span class="pl-5 text-[#333333]">{{ currentUser.email }}</span>
                    </div>
                    <div class="pb-[30px] flex items-center">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Full Name</span>
                        <el-form-item prop="fullName">
                            <el-input size="large" v-model="currentUser.fullName"
                                style="width: 400px; padding-left: 20px; color: #333333;" />
                        </el-form-item>
                    </div>
                    <div class="pb-[30px] flex items-center">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Phone Number</span>
                        <el-form-item prop="phone">
                            <el-input size="large" v-model="currentUser.phone"
                                style="padding-left: 20px; color: #333333; width: 400px;" />
                        </el-form-item>
                    </div>
                    <div class="pb-[30px] flex items-center">
                        <span class="text-[#555555CC] min-w-[30%] text-right">Address</span>
                        <el-form-item prop="address">
                            <el-input size="large" v-model="currentUser.address"
                                style="padding-left: 20px; color: #333333; width: 400px;" />
                        </el-form-item>
                    </div>
                    <div class="pb-[30px] flex">
                        <span class=" min-w-[30%] text-right"></span>
                        <button
                            class="px-5 py-2 border border-gray-300 bg-[#409EFF] ml-5 text-white hover:bg-[#3A8EE4] text-base font-semibold rounded-md transition-all"
                            type="submit">Save</button>
                    </div>
                </el-form>
            </div>
            <div class="min-w-[30%] flex flex-col items-center justify-center">
                <!-- <label class="cursor-pointer">
                    <input type="file" hidden ref="fileInput">
                    <img v-if="currentUser.avatar" :src="currentUser.avatar" alt="Avatar" height="200" width="200"
                        class="rounded-full" @click="openFileInput">
                    <img v-else
                        src="https://gcs.tripi.vn/public-tripi/tripi-feed/img/474090QTs/anh-avatar-vit-ngao-sieu-cute_084403989.jpg"
                        alt="Avatar" height="200" width="200" class="rounded-full" @click="openFileInput">
                </label> -->
                <el-upload
                    class="avatar-uploader"
                    v-model="currentUser.avatar"
                    action="true"
                    :show-file-list="false"
                    :http-request="upload"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="currentUser.avatar" :src="currentUser.avatar" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <button
                    class="px-5 mt-10 py-2 border border-gray-300 ml-5 hover:bg-[#409EFF] hover:text-white text-base font-semibold rounded-md transition-all"
                    @click="changeAvatar">Update Avatar</button>
            </div>
        </div>
    </div>
    <el-dialog v-model="isShowChangePassword" width="600" style="border-radius: 16px;">
        <div class="flex flex-col text-sm h-[65%] items-center justify-center rounded-lg gap-5">
            <el-form ref="passwordForm" :model="changePasswordForm" @submit.prevent="submitChangePassword"
                label-width="auto" :rules="rules">
                <h1 class="text-3xl flex items-center justify-center mb-10 font-bold">Change Password</h1>
                <div class="flex flex-col mb-5 gap-2">
                    <span>Current Password</span>
                    <el-form-item prop="currentPassword">
                        <el-input size="large" type="password" show-password
                            v-model="changePasswordForm.currentPassword" placeholder="Please input your old password"
                            style="width: 400px; color: #333333;" />
                    </el-form-item>
                </div>
                <div class="flex flex-col mb-5 gap-2">
                    <span class="pb-[3px]">New Password</span>
                    <el-form-item prop="newPassword">
                        <el-input size="large" type="password" show-password v-model="changePasswordForm.newPassword"
                            placeholder="Please input your new password" style="width: 400px; color: #333333;" />
                    </el-form-item>
                </div>
                <div class="flex flex-col mb-10 gap-2">
                    <span class="pb-[3px]">Confirm Password</span>
                    <el-form-item prop="confirmNewPass">
                        <el-input size="large" type="password" show-password v-model="changePasswordForm.confirmNewPass"
                            placeholder="Please confirm your new password" style="width: 400px; color: #333333;" />
                    </el-form-item>
                </div>
                <div class="flex pb-8 items-center justify-center gap-4">
                    <button class="hover:bg-[#E23F33] text-[#E23F33] border-gray-300 border rounded-md py-[7px] px-5 hover:text-white transition" @click.prevent="isShowChangePassword = false">Cancel</button>
                    <button class="border rounded-md py-[7px] px-5 bg-[#409EFF] hover:bg-[#3A8EE4] transition text-white" type="submit">Confirm</button>
                </div>
            </el-form>
        </div>
    </el-dialog>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { authStore } from '../../stores/auth.store'
import { updateProfile, changePassword, updateAvatar } from '../../services/user.service'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { uploadImage } from "../../plugins/uploadImage";


const form = ref(null)
const passwordForm = ref(null)
const userAuth = authStore()
const isValids = ref([false, false, false])
const isValids2 = ref([false, false, false])
const isShowChangePassword = ref(false)

// const handleAvatarSuccess = (response,uploadFile) => {
//     console.log(response, uploadFile);
//     // imageUrl.value = URL.createObjectURL(uploadFile.raw)
// }

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}


const currentUser = reactive({
    fullName: userAuth.user.fullName,
    email: userAuth.user.email,
    phone: userAuth.user.phone,
    address: userAuth.user.address,
    avatar: userAuth.user.avatar
})

const changePasswordForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmNewPass: '',
})

const upload = async (file) => {
    console.log(file);
    try {
        currentUser.avatar = await uploadImage(file.file);
        console.log("Upload successful:", currentUser.avatar);
    } catch (error) {
        ElNotification.error({
            title: 'Upload Error',
            message: 'Failed to upload image!',
        });
        console.error("Upload error:", error);
    }
}

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
    } else if (field === 1 || field === 2) {
        if (changePasswordForm.newPassword != changePasswordForm.confirmNewPass) {
            return new Error('Passwords do not match')
        }
    }
}

const validateOldPass = (rule, value, callback) => {
    const errorMessage = 'Current Password is required'
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
    phone: [{ validator: validatePhone, trigger: 'blur' }],
    address: [{ validator: validateAddress, trigger: 'blur' }],
    currentPassword: [{ validator: validateOldPass, trigger: 'blur' }],
    newPassword: [{ validator: validateNewPass, trigger: 'blur' }],
    confirmNewPass: [{ validator: validateConfirmNewPass, trigger: 'blur' }]
})


const submit = async () => {
    try {
        await updateProfile(currentUser)
        ElNotification({
            title: 'Update Profile',
            message: 'Update Profile Successfully!',
            type: 'success',
        });
    } catch (error) {
        ElNotification({
            title: 'Update Profile',
            message: 'Update Profile Failed!',
            type: 'error',
        });
    }
}

const changeAvatar = async () => {
    try {
        await updateAvatar(currentUser.avatar)
        ElNotification({
            title: 'Update Avatar',
            message: 'Update Avatar Successfully!',
            type: 'success',
        });
    } catch (error) {
        ElNotification({
            title: 'Update Avatar',
            message: 'Update Avatar Failed!',
            type: 'error',
        });
    }
}

const submitChangePassword = async () => {
    // try {
    //     await changePassword(changePasswordForm)
    //     ElNotification({
    //         title: 'Change Password',
    //         message: 'Change Password Successfully!',
    //         type: 'success',
    //     });
    // } catch (error) {
    //     ElNotification({
    //         title: 'Change Password',
    //         message: 'Change Password Failed!',
    //         type: 'error',
    //     });
    // }
    try {
        const valid = await new Promise((resolve) => {
            passwordForm.value.validate((valid) => {
                resolve(valid)
            })
        })

        if (valid) {
            console.log('success')
            await changePassword(changePasswordForm)
            ElNotification({
                title: 'Change Password',
                message: 'Change Password Successfully!',
                type: 'success',
            });
        } else {
            console.log('error submit!')
            ElNotification({
                title: 'Change Password',
                message: 'Change Password Failed!',
                type: 'error',
            });
            return false
        }
    } catch (error) {
        console.log('error')
        ElNotification({
            title: 'Change Password',
            message: 'Change Password Failed!',
            type: 'error',
        });
        console.log(error)
    }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.el-form-item {
    margin-bottom: 0 !important;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 100%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>