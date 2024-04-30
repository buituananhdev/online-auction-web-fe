<template>
    <div v-if="authStore().isLoggedIn" class="flex min-h-screen">
        <el-container>
            <el-header>
                <the-header>
                    <el-input
                        v-model="searchValue"
                        style="width: 35%; border-radius: 30px"
                        placeholder="Search..."
                        class="input-with-select"
                        @keyup.enter="handleClickSearch"
                    >
                        <template #append>
                            <el-button :icon="SearchIcon" @click="handleClickSearch" />
                        </template>
                    </el-input>
                </the-header>
            </el-header>
            <el-main style="background-color: #ffff; margin: 0 120px;  overflow: hidden; min-width: 1100px">
                <div class="flex flex-col">
                    <div class="flex items-end justify-between pb-4 border-b-[1px] border-gray-300">
                        <h1 class="text-[#363636] text-3xl font-bold my-[19px]">My eBay</h1>
                        <a href="" class="text-[13px] mb-4 underline text-[#3665f3] font-medium"> Tell us what you think</a>
                    </div>
                    <div class="flex">
                        <div class="min-h-[800px] w-[18.75%] pr-8 my-8 flex flex-col">
                            <ul class="text-[#363636] font-bold">
                                <li class="py-[10px] pl-4">
                                    <RouterLink to="/seller-history">Seller history</RouterLink>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <RouterLink to="/recently-viewed">Recently viewed</RouterLink>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <RouterLink to="/buyer-history">Bids & offers</RouterLink>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="watchlist">Watchlist</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">Saved searches</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">Saved sellers</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">My Garage</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">Sizes</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">Selling</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">Collection beta</a>
                                </li>
                                <li class="py-[10px] pl-4">
                                    <a href="">The eBay vault</a>
                                </li>
                            </ul>
                        </div>
                        <div class="flex-auto">
                            <slot />
                        </div>
                    </div>
                </div>
            </el-main>
            <el-footer style="padding: 0;"><the-footer/></el-footer>
        </el-container>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import TheHeader from '../components/Layout/TheHeader.vue'
import TheFooter from '../components/Layout/TheFooter.vue'
import { authStore } from '../stores/auth.store'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const searchValue = ref('')
const SearchIcon = Search
const router = useRouter()
const route = useRoute()
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
onMounted(() => {
    if (route.query.search) {
        searchValue.value = route.query.search.toString()
    }
})
</script>
