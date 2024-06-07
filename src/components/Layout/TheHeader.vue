<template>
    <div class="absolute z-99 top-0 left-0 z-50 w-full flex flex-col">
        <div class="h-[65px] bg-white flex items-center justify-around px-5 border-b border-gray-300">
            <div class="flex items-center gap-3">
                <img width="50" class="rounded-full"
                    src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=mYaPYCfznu4AX9xv_jp&_nc_ht=scontent.fdad3-6.fna&oh=00_AfB9VxyP9nHo5xo_XgDip71TokS9kjdKrUIKxyIf8EQOQw&oe=6602BD50"
                    alt="" />
                <router-link to="/"><span class="text-2xl text-[#409eff] font-bold">MaVile</span></router-link>
            </div>
            <slot />
            <div class="flex gap-6" v-if="useAuth.isLoggedIn">
                <el-dropdown>
                    <span class="flex items-center">
                        My MaVile
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-if="role == 'Seller'" @click="router.push('/seller-history')">Seller
                                History</el-dropdown-item>
                            <el-dropdown-item v-if="role == 'Seller'" @click="router.push('/create-auction')">Create
                                Auction</el-dropdown-item>
                            <el-dropdown-item v-if="role == 'Buyer'" @click="router.push('/buyer-history')">Bids &
                                Offers</el-dropdown-item>
                            <el-dropdown-item v-if="role == 'Buyer'"
                                @click="router.push('/auctions')">Auctions</el-dropdown-item>
                            <el-dropdown-item v-if="role == 'Buyer'"
                                @click="router.push('/watchlist')">Watchlist</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-dropdown style="margin-top: 6px;" trigger="click">
                    <el-badge v-if="unreadNotificationCount" :value="unreadNotificationCount" class="item">
                        <img src="../../assets/icons/bell-icon.svg" class="cursor-pointer" width="20" alt="" />
                    </el-badge>
                    <img v-else src="../../assets/icons/bell-icon.svg" class="cursor-pointer" width="20" alt="" />
                    <template #dropdown>
                        <el-dropdown-menu style="width: 300px; max-height: 40vh; padding-top: 15px;"
                            class="header-notification-list">
                            <el-dropdown-item v-if="notificationList.length === 0">You don't have any
                                notification</el-dropdown-item>
                            <el-dropdown-item v-else v-for="item in notificationList" @click="goToItemURL(item)"
                                :key="item.id" :style="getStyle(item.isRead)" :icon="Plus">
                                <div class="flex gap-1">
                                    <el-icon size="23" style="margin-top: 4px"
                                        :color="item.type === 3 ? '#00aa00' : '#4093ff'">
                                        <SuccessFilled v-show="item.type === 3" />
                                        <Comment v-show="item.type === 2" />
                                        <PriceTag v-show="item.type === 1" />
                                    </el-icon>
                                    <div class="flex flex-col">
                                        <span class="font-semibold">{{ item.title }}</span>
                                        <span class="text-xs">{{ item.content }}</span>
                                        <span class="text-xs mt-1">{{ getTimeDifference(item.dateCreated) }}</span>
                                    </div>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div v-if="useAuth.isLoggedIn" class="container flex justify-end items-center gap-4 w-fit ml-4">
                <span class="font-[550]">{{ useAuth.user.fullName }} | </span>
                <el-popover placement="bottom-end" :width="200" trigger="click" class="p-0">
                    <ul>
                        <li class="border-b py-2 cursor-pointer" @click="pushToProfile">My account</li>
                        <li class="pt-2 cursor-pointer" @click="signOut">Sign out</li>
                    </ul>
                    <template #reference>
                        <el-avatar style="cursor: pointer"
                            :src="useAuth.user.avatar" />
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
                <li v-for="item in categories" :key="item.id"
                    class="text-xs text-[#505050] cursor-pointer py-1 px-2 rounded-lg hover:bg-[#EEEEEE]">
                    <a :href="'/auctions?categories='">{{ item.categoryName }}</a>
                </li>
            </ul>
        </div>
    </div>
    
</template>
<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '../../stores/auth.store'
import { useCategoryStore } from '../../stores/category.store'
import { ArrowDown, SuccessFilled, Comment, PriceTag } from '@element-plus/icons-vue'
import { useNotificationStore } from '../../stores/notification.store'
import { getTimeDifference } from '../../utils/index'

const role = localStorage.getItem('role')

const props = defineProps({
    modelValue: {
        type: String,
        require: true,
    },
})

const useCategory = useCategoryStore()
const value = ref('')
const useNotification = useNotificationStore()
const useAuth = authStore()
const router = useRouter()
const categories = ref([])
const isPopupVisible = ref(false)
const isEditPopupVisible = ref(false)
const notificationList = computed(() => useNotification.notificationList)
const unreadNotificationCount = computed(() => useNotification.newNotificationCount)

function getStyle(condition) {
    return condition
        ? {
            width: '100%',
            borderBottom: '1px solid #f8f8f8',
            whiteSpace: 'break-spaces',
        }
        : {
            width: '100%',
            whiteSpace: 'break-spaces',
            fontWeight: '550',
            borderBottom: '1px solid #ffff',
            backgroundColor: '#f8f8f8'
        };
}

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

async function getNotificationList() {
    try {
        await useNotification.updateNotificationList()
        // notificationList.value = useNotification.notificationList
    } catch (error) {
        console.error(error);
    }
}

async function goToItemURL(item) {
    if (!item.isRead) {
        useNotification.decreaseNotification()
        item.isRead = true
        await useNotification.markReadNotification(item.id)
    }
    router.push(item.redirectUrl)
}

function pushToProfile() {
    router.push('/profile')
}

onMounted(async () => {
    document.addEventListener('click', handleOutsideClick)
    await useCategory.getCategoryList()
    categories.value = useCategory.categoryList
    useAuth.isLoggedIn && getNotificationList()
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

<style scoped>
.header-notification-list {}
</style>