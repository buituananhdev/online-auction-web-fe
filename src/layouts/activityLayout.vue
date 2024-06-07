<template>
    <div v-if="authStore().isLoggedIn" class="flex min-h-screen">
        <el-container>
            <el-header>
                <the-header>
                    <el-input v-model="searchValue" style="width: 35%; border-radius: 30px" placeholder="Search..."
                        class="input-with-select" @keyup.enter="handleClickSearch">
                        <template #append>
                            <el-button :icon="SearchIcon" @click="handleClickSearch" />
                        </template>
                    </el-input>
                </the-header>
            </el-header>
            <el-main style="background-color: #ffff; margin: 0 120px; overflow: hidden; min-width: 1100px">
                <div class="flex flex-col">
                    <div class="flex items-end justify-between pb-4 border-b-[1px] border-gray-300">
                        <h1 class="text-[#363636] text-3xl font-bold my-[19px]">My eBay</h1>
                        <span class="text-[13px] mb-4 underline text-[#409EFF] font-medium cursor-pointer">
                            Tell us what you think</span>
                    </div>
                    <div class="flex">
                        <!-- <div class="min-h-[800px] w-[18.75%] pr-8 my-8 flex flex-col">
                            <ul class="text-[#363636] font-bold">
                                <li v-if="role == 'Seller'" class="py-[10px] pl-4">
                                    <RouterLink to="/seller-history">Seller history</RouterLink>
                                </li>
                                <li v-if="role == 'Seller'" class="py-[10px] pl-4">
                                    <RouterLink to="/create-auction">Create auction</RouterLink>
                                </li>
                                <li v-if="role == 'Buyer'" class="py-[10px] pl-4">
                                    <RouterLink to="/buyer-history">Bids & offers</RouterLink>
                                </li>
                                <li v-if="role == 'Buyer'" class="py-[10px] pl-4">
                                    <a href="watchlist">Watchlist</a>
                                </li>
                                <li v-if="role == 'Buyer'" class="py-[10px] pl-4">
                                    <a href="profile">Profile</a>
                                </li>
                            </ul>
                        </div> -->
                        <div class="flex flex-col">
                            <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                                <el-radio-button :value="false">expand</el-radio-button>
                                <el-radio-button :value="true">collapse</el-radio-button>
                            </el-radio-group> -->
                            <el-menu :default-active="activeItem" class="el-menu-vertical-demo"
                                :collapse="isCollapse" @open="handleOpen" @close="handleClose" v-model="status">
                                <el-sub-menu index="1" v-if="role == 'Seller'">
                                    <template #title>
                                        <el-icon><sold-out /></el-icon>
                                        <span>Seller History</span>
                                    </template>
                                    <el-menu-item-group>
                                        <template #title><span>Status</span></template>
                                        <el-menu-item index="1-1" @click="router.push('/seller-history')">All sold
                                            items</el-menu-item>
                                        <el-menu-item index="1-2"
                                            @click="router.push({ path: '/seller-history', query: { status: 1 } })">Inprogress</el-menu-item>
                                        <el-menu-item index="1-3"
                                            @click="router.push({ path: '/seller-history', query: { status: 2 } })">Ended</el-menu-item>
                                        <el-menu-item index="1-4"
                                            @click="router.push({ path: '/seller-history', query: { status: 3 } })">Cancel</el-menu-item>
                                        <el-menu-item index="1-5"
                                            @click="router.push({ path: '/seller-history', query: { status: 4 } })">Pending
                                            Publish</el-menu-item>
                                    </el-menu-item-group>
                                    <!-- <el-menu-item-group title="Group Two">
                                        <el-menu-item index="1-3">item three</el-menu-item>
                                    </el-menu-item-group>
                                    <el-sub-menu index="1-4">
                                        <template #title><span>item four</span></template>
                                        <el-menu-item index="1-4-1">item one</el-menu-item>
                                    </el-sub-menu> -->
                                </el-sub-menu>
                                <el-menu-item index="2" v-if="role == 'Seller'" @click="router.push('/create-auction')">
                                    <el-icon><document-add /></el-icon>
                                    <template #title>Create Auction</template>
                                </el-menu-item>
                                <el-menu-item index="5" v-if="role == 'Buyer'" @click="router.push('/buyer-history')">
                                    <el-icon>
                                        <img src="../assets/icons/bid.svg" width="18" alt="" />
                                    </el-icon>
                                    <template #title>Bids & Offers</template>
                                </el-menu-item>
                                <el-menu-item index="3" v-if="role == 'Buyer' || 'Seller'"
                                    @click="router.push('/profile')">
                                    <el-icon>
                                        <img src="../assets/icons/user.svg" width="18" alt="" />
                                    </el-icon>
                                    <template #title>Personal Profile</template>
                                </el-menu-item>
                                <el-menu-item index="4" v-if="role == 'Buyer'" @click="router.push('/auctions')">
                                    <el-icon>
                                        <img src="../assets/icons/auction.svg" width="18" alt="" />
                                    </el-icon>
                                    <template #title>Auctions</template>
                                </el-menu-item>
                                <el-menu-item index="6" v-if="role == 'Buyer'" @click="router.push('/watchlist')">
                                    <el-icon>
                                        <img src="../assets/icons/heart-icon.svg" width="18" alt="" />
                                    </el-icon>
                                    <template #title>Watchlist</template>
                                </el-menu-item>
                            </el-menu>
                        </div>
                        <div class="ml-5 flex-auto">
                            <slot />
                        </div>
                    </div>
                </div>
            </el-main>
            <el-footer style="padding: 0"><the-footer /></el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import TheHeader from '../components/Layout/TheHeader.vue'
import TheFooter from '../components/Layout/TheFooter.vue'
import { authStore } from '../stores/auth.store'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import {
    DocumentAdd,
    Menu as IconMenu,
    SoldOut,
    User,
} from '@element-plus/icons-vue'

const searchValue = ref('')
const status = ref(null)
const isCollapse = ref(false)
const SearchIcon = Search
const router = useRouter()
const route = useRoute()
const role = localStorage.getItem('role')
const activeItem = ref()

const handleHighLightItem = () => {
    if(window.location.pathname === '/profile') {
        activeItem.value = '3'
    } else if(window.location.pathname.startsWith('/seller-history')) {
        activeItem.value = '1-1'
    } else if(window.location.pathname === '/watchlist') {
        activeItem.value = '6'
    } else if(window.location.pathname === '/buyer-history') {
        activeItem.value = '5'
    }
}

const handleClickSearch = () => {
    if (searchValue.value.trim() !== '') {
        router.push({
            path: '/auctions',
            query: { search: searchValue.value.trim() },
        })
    } else {
        const { search, ...queryWithoutSearch } = route.query
        router.push({ path: '/auctions', query: queryWithoutSearch })
    }
}
const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
onMounted(() => {
    if (route.query.search) {
        searchValue.value = route.query.search.toString()
    }
    if (route.query.status) {
        status.value = route.query.status
    }

    handleHighLightItem()
})
</script>
<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 100%;
}
</style>