<template>
    <div class="w-full">
        <div class="mt-6 ml-2">
            <div class="flex justify-between gap-5 my-[42px]">
                <span class="font-bold text-2xl flex items-center justify-center">Seller history</span>
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

            <div class="flex flex-col">
                <div class="pb-8 flex items-center justify-between">
                    <span class="font-bold text-xl">{{ getTitle(status) }}</span>
                </div>
                <div v-if="listSellerHistorys?.length" class="w-full flex flex-col items-center justify-center gap-4 relative pb-16">
                    <div
                        v-for="item in listSellerHistorys"
                        :key="item.id"
                        class="w-full flex items-center justify-center"
                    >
                        <history-card :auction="item" @cancel-auction="handleCancelAuction(item)" />
                    </div>
                    <div class="flex justify-end w-full absolute bottom-0 right-0 gap-3">
                        <span class="text-sm underline text-[#409EFF] cursor-pointer" @click="meta.pageSize += size"
                            v-show="meta.pageSize < meta.totalPages * meta.pageSize">Load more</span>
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
import { getSellerHistory, cancelAuction } from '../../../services/auction.service'

const SearchIcon = Search
const router = useRouter()
const route = useRoute()
const searchValue = ref('')

const status = computed(() => {
    console.log(route.query);
    return route.query.status
})
const size  = 5

const meta = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
})

const listSellerHistorys = ref([])

const getTitle = (status) => {
    switch (status) {
        case '1':
            return 'Inprogress'
        case '2':
            return 'Ended'
        case '3':
            return 'Canceled'
        case '4':
            return 'Pending Publish'
        default: 
            return ''
    }
}

const loading = computed(() => {
    return !Boolean(listSellerHistorys.value.length > 0)
})

watch(searchValue, async () => {
    await SearchHistory()
})

watch(status, async () => {
    await SearchHistory()
})

watch(() => meta.value.pageSize, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await SearchHistory()
    }
})

const getHistory = async (currentPage, pageSize, searchQuery, status) => {
    try {
        const res = await getSellerHistory(currentPage, pageSize, searchQuery, status)
        listSellerHistorys.value = res.data.data
        meta.value = res.data.meta
        console.log('list', listSellerHistorys.value)
    } catch (error) {
        console.log(error)
    }
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
        await getHistory(meta.value.currentPage, meta.value.pageSize, searchValue.value, status.value)
    }
}

const handleCancelAuction = async(auction) => {
    try {
        await cancelAuction(auction.id)
        ElNotification({
            title: 'Cancel Auction',
            message: 'Cancel Auction Successfully!',
            type: 'success',
        })
        refreshData()
    } catch (error) {
        ElNotification({
            title: 'Cancel Auction',
            message: 'Cancel Auction Failed!',
            type: 'error',
        })
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
