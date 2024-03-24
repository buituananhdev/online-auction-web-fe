<template>
    <div class="shadow-md fixed z-99 top-0 left-0 h-[65px] w-full bg-white flex items-center justify-around z-50 px-5">
        <div class="flex items-center gap-3">
            <img
                width="50"
                class="rounded-full"
                src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=mYaPYCfznu4AX9xv_jp&_nc_ht=scontent.fdad3-6.fna&oh=00_AfB9VxyP9nHo5xo_XgDip71TokS9kjdKrUIKxyIf8EQOQw&oe=6602BD50"
                alt=""
            />
            <p>Web Name</p>
        </div>

        <el-input
            v-model="input3"
            style="width: 35%; border-radius: 30px"
            placeholder="Search..."
            class="input-with-select"
        >
            <template #append>
                <el-button style="" :icon="Search" />
            </template>
        </el-input>
        <div class="flex gap-6">
            <el-select v-model="value" placeholder="WatchList" style="width: 110px">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <img src="../../assets/icons/bell-icon.svg" class="cursor-pointer" width="20" alt="" />
        </div>
        <div class="container flex justify-end items-center gap-4 w-fit">
            <span>{{ user.name }} | </span>
            <el-popover placement="bottom-end" :width="200" trigger="click" class="p-0">
                <ul>
                    <li class="border-b py-2 cursor-pointer">My account</li>
                    <li class="pt-2 cursor-pointer" @click="signOut">Sign out</li>
                </ul>
                <template #reference>
                    <el-avatar
                        style="cursor: pointer"
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                    />
                </template>
            </el-popover>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../stores/auth.store'
import { Search } from '@element-plus/icons-vue'

const options = [
    {
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    },
    {
        value: 'Option3',
        label: 'Option3',
    },
    {
        value: 'Option4',
        label: 'Option4',
    },
    {
        value: 'Option5',
        label: 'Option5',
    },
]
const router = useRouter()
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
const signOut = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    authStore().isLoggedIn = false
    router.push({ name: 'login' })
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
})
</script>
<style>
.el-input-group__append {
    border-top-right-radius: 30px;
    border-bottom-right-radius: 30px;
}
.el-input__wrapper {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
}
</style>
