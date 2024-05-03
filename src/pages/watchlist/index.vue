<template>
    <div v-loading="isLoading" class="w-full">
        <div class="w-full">
            <div class="flex justify-between gap-5 pt-[25px] pb-8">
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

            <div class="flex flex-col mt-8">
                <div v-if="watchlist.length" class="w-full flex flex-col items-center justify-center gap-4 relative pb-16">
                    <div
                        v-for="item in watchlist"
                        :key="item.id"
                        class="w-full flex items-center justify-center"
                    >
                        <!-- <history-card :auction="item" /> -->
                        <history-card :auction="item" :isInWatchlist="true"/>
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
import { getWatchlist } from '../../services/watchlist.service'

const SearchIcon = Search
const router = useRouter()
const route = useRoute()
const searchValue = ref('')
const status = ref('')
const size = 5
const isLoading = ref(true)

const meta = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
})

const watchlist = ref([])

watch(watchlist, () => {
    isLoading.value = !isLoading.value
})

watch(searchValue, async () => {
    await SearchWatchlist()
})

watch(() => meta.value.pageSize, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await SearchWatchlist()
    }
})

const getWatchedList = async (currentPage, pageSize, searchQuery, type) => {
    try {
        const res = await getWatchlist(currentPage, pageSize, searchQuery, type)
        watchlist.value = res.data.data
        meta.value = res.data.meta
    } catch (error) {
        console.log(error)
    }
}

const filterStatus = async (value) => {
    status.value = value
    await SearchWatchlist()
}

const handleClickSearch = () => {
    if (searchValue.value.trim() !== '') {
        console.log(searchValue.value)
        router.push({
            path: '/watchlist',
            query: { search: searchValue.value.trim() },
        })
    } else {
        const { search, ...queryWithoutSearch } = route.query
        router.push({ path: '/watchlist', query: queryWithoutSearch })
    }
}

const SearchWatchlist = async () => {
    try {
        const res = await getWatchlist(meta.value.currentPage, meta.value.pageSize, searchValue.value, status.value)
        meta.value = res.data.meta
        watchlist.value = res.data.data

        const query = {}
        if (searchValue.value) {
            query.search = searchValue.value
        }
        if (status.value) {
            query.status = status.value
        }
        console.log('query1', query)
        router.push({ path: `/watchlist`, query })
        console.log('query2', query)
    } catch (error) {
        console.log(error)
    }
}

const refreshData = async () => {
    if (searchValue.value || status.value) {
        await SearchWatchlist()
    } else {
        await getWatchedList(meta.value.currentPage, meta.value.pageSize)
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
