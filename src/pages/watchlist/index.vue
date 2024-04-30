<template>
    <div v-loading="loading" class="w-full">
        <div class="w-full">
            <div class="flex justify-between gap-5 pt-[25px] pb-8 border-b-[1px] border-gray-300">
                <span class="font-bold text-2xl flex items-center justify-center">My eBay - Watchlist</span>
                <div class="w-1/2">
                    <div class="w-full flex items-center justify-center">
                        <el-input
                            v-model="searchValue"
                            style="border-radius: 30px"
                            placeholder="Search..."
                            class="input-with-select"
                            @keyup.enter="handleClickSearch"
                            clearable
                            size="large"
                        >
                            <template #append>
                                <el-button :icon="SearchIcon" @click="handleClickSearch" />
                            </template>
                        </el-input>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-4 my-4 pb-4 border-b-[1px] border-gray-300">
                <div v-for="item in listProductStatus" :key="item.value" class="">
                    <span
                        :class="{ 'bg-[#ededed]': selectedItem === item.value }"
                        class="px-4 py-1 flex items-center justify-center border-gray-600 border-[1px] rounded-full bg-[#f7f7f7] hover:cursor-pointer hover:bg-[#ededed]"
                        @click="filterStatus(item.value)"
                    >
                        {{ item.text }}
                    </span>
                </div>
            </div>

            <div class="flex flex-col mt-8">
                <div v-if="listSellerHistorys.length" class="w-full flex flex-col items-center justify-center gap-4 relative pb-16">
                    <div
                        v-for="item in listSellerHistorys"
                        :key="item.id"
                        class="w-full flex items-center justify-center"
                    >
                        <!-- <history-card :auction="item" /> -->
                        <watchlist-card :auction="item" />
                    </div>
                    <div class="flex justify-end w-full absolute bottom-0 right-0">
                        <el-pagination
                            v-show="meta.totalPages > 1"
                            v-model:current-page="meta.currentPage"
                            background
                            layout="prev, pager, next"
                            :total="meta.totalPages * meta.pageSize"
                        />
                    </div>
                </div>
                <div v-else class="w-full">
                    <el-empty description="No data" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getSellerHistory } from '../../services/auction.service'

const SearchIcon = Search
const router = useRouter()
const route = useRoute()
const searchValue = ref('')
const status = ref('')
const selectedItem = ref(null)

const meta = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 8,
})

const listSellerHistorys = ref([])
const listProductStatus = ref([
    { value: null, text: 'All Sold' },
    { value: 1, text: 'Available' },
    { value: 2, text: 'Sold' },
    { value: 3, text: 'Deleted' },
    { value: 4, text: 'Canceled' },
    { value: 5, text: 'Pending Publish' },
])

const loading = computed(() => {
    return !Boolean(listSellerHistorys.value.length > 0)
})

watch(searchValue, async () => {
    await SearchHistory()
})

watch(() => meta.value.currentPage, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await SearchHistory()
    }
})

const getHistory = async (currentPage, pageSize, searchQuery, status) => {
    try {
        const res = await getSellerHistory(currentPage, pageSize, searchQuery, status)
        console.log(res)
        listSellerHistorys.value = res.data.data
        meta.value = res.data.meta
        console.log('list', listSellerHistorys.value)

        // console.log('meta', meta)
    } catch (error) {
        console.log(error)
    }
}

const filterStatus = async (value) => {
    selectedItem.value = value
    status.value = value
    await SearchHistory()
}

const createAuction = () => {
    router.push({ path: '/create-auction' })
}

const handleClickSearch = () => {
    if (searchValue.value.trim() !== '') {
        console.log(searchValue.value)
        router.push({
            path: '/seller-history',
            query: { search: searchValue.value.trim() },
        })
    } else {
        const { search, ...queryWithoutSearch } = route.query
        router.push({ path: '/seller-history', query: queryWithoutSearch })
    }
}

const SearchHistory = async () => {
    try {
        const res = await getSellerHistory(meta.value.currentPage, meta.value.pageSize, searchValue.value, status.value)
        meta.value = res.data.meta
        listSellerHistorys.value = res.data.data

        const query = {}
        if (searchValue.value) {
            query.search = searchValue.value
        }
        if (status.value) {
            query.status = status.value
        }
        console.log('query1', query)
        router.push({ path: `/seller-history`, query })
        console.log('query2', query)
    } catch (error) {
        console.log(error)
    }
}

const refreshData = async () => {
    if (searchValue.value || status.value) {
        await SearchHistory()
    } else {
        await getHistory(meta.value.currentPage, meta.value.pageSize)
    }
}

onBeforeMount(async () => {
    await refreshData()
})

onMounted(() => {
    if (route.query.search) {
        searchValue.value = route.query.search.toString()
    }
})
</script>

<style scoped>
.demo-image__error .image-slot {
    font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
    font-size: 30px;
}
.demo-image__error .el-image {
    width: 100%;
    height: 300px;
}
.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}
</style>
