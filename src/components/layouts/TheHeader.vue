<template>
    <div class="fixed top-0 left-0 h-[70px] w-full bg-white flex items-center justify-around z-50 px-5">
        <div class="flex items-center gap-3">
            <img width="50" class="rounded-full" src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=mYaPYCfznu4AX9xv_jp&_nc_ht=scontent.fdad3-6.fna&oh=00_AfB9VxyP9nHo5xo_XgDip71TokS9kjdKrUIKxyIf8EQOQw&oe=6602BD50" alt="">
            <p>Web Name</p>
        </div>
        <el-input v-model="input3" style="width: 40%; border-radius: 16px;" placeholder="Please input" class="input-with-select">
            <template #prepend>
                <el-button :icon="Search" />
            </template>
            <template #append>
                <el-select v-model="select" placeholder="Select" style="width: 115px">
                    <el-option label="Restaurant" value="1" />
                    <el-option label="Order No." value="2" />
                    <el-option label="Tel" value="3" />
                </el-select>
            </template>
        </el-input>
        <div class="container flex justify-end items-center gap-4 w-fit">
            <span>{{ user.name }} | </span>
            <el-avatar
                src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { authStore } from '../../stores/auth.store'
import { Search } from '@element-plus/icons-vue'

const onBack = () => {
    notify('Back')
}
const input = ref('')

const user = ref({
    name: 'hehehhe',
})
const isPopupVisible = ref(false)
const isEditPopupVisible = ref(false)

const togglePopup = () => {
    isPopupVisible.value = !isPopupVisible.value
}

const exitPopupEdit = () => {
    isEditPopupVisible.value = false
}

const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
}

const handleOutsideClick = (event) => {
    if (isPopupVisible.value) {
        const clickedElement = event.target
        const logoutContainer = document.querySelector('.logout-container')
        if (logoutContainer && !logoutContainer.contains(clickedElement)) {
            isPopupVisible.value = false
        }
    }
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
})
</script>
<style scoped>
</style>