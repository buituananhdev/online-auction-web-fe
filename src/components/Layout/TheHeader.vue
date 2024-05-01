<template>
    <div class="absolute z-99 top-0 left-0 z-50 w-full flex flex-col">
        <div
            class="h-[65px] bg-white flex items-center justify-around px-5 border-b border-gray-300"
        >
            <div class="flex items-center gap-3">
                <img
                    width="50"
                    class="rounded-full"
                    src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=mYaPYCfznu4AX9xv_jp&_nc_ht=scontent.fdad3-6.fna&oh=00_AfB9VxyP9nHo5xo_XgDip71TokS9kjdKrUIKxyIf8EQOQw&oe=6602BD50"
                    alt=""
                />
                <router-link to="/">Web Name</router-link>
            </div>
            <slot />
            <div class="flex gap-6"  v-if="useAuth.isLoggedIn">
                <el-select v-model="value" placeholder="WatchList" style="width: 110px">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <img src="../../assets/icons/bell-icon.svg" class="cursor-pointer" width="20" alt="" />
            </div>
            <div v-if="useAuth.isLoggedIn" class="container flex justify-end items-center gap-4 w-fit">
                <span>{{ useAuth.user.fullName }} | </span>
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
            <div v-else>
                <el-button type="primary" @click="router.push('/register')">Sign up</el-button>
                <el-button @click="router.push('/login')">Sign in</el-button>
            </div>
        </div>
        <div class="h-[30px] w-full py-2 flex justify-center bg-white border-b">
            <ul class="justify-center text-center flex items-center gap-6">
                <li v-for="(item, index) in categories" :key="index" class="text-xs text-[#505050] cursor-pointer py-1 px-2 rounded-lg hover:bg-[#EEEEEE]">
                    <a :href="'/auctions?categories=' + item.id">{{ item.categoryName }}</a> 
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../stores/auth.store'
import { getListCategories } from '../../services/category.service'
import { useCategoryStore } from '../../stores/category.store'


const props = defineProps({
    modelValue: {
        type: String,
        require: true,
    },
})
const useCategory = useCategoryStore()
const value = ref('')
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
const useAuth = authStore()
const router = useRouter()
const user = ref({
    name: 'hehehhe',
})
const categories = ref([])
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
    localStorage.setItem('isAuthPage', true)
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
    useAuth.isLoggedIn = false
    router.push({ name: 'login' })
    localStorage.setItem('isAuthPage', true)
}

const getCategoryList = async () => {
    try {
        const res = await getListCategories()
        categories.value = res.data.data
        console.log(categories.value);
    } catch (error) {
        console.error(error);
    }
}


onMounted(async () => {
    document.addEventListener('click', handleOutsideClick)
    await useCategory.getCategoryList()
    categories.value = useCategory.categoryList
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
    /* border-top-left-radius: 30px;
    border-bottom-left-radius: 30px; */
    border-radius: 30px;
}
</style>
