<template>
    <div class="w-full">
        <div class="w-full mt-6 ml-2">
            <div class="flex justify-between gap-5 my-4">
                <span class="font-semibold text-2xl flex items-center justify-center">Bids & Offers</span>
                <div class="w-1/2">
                    <div class="w-full flex items-center justify-center">
                        <el-input v-model="searchValue" style="border-radius: 30px" placeholder="Search..."
                            class="input-with-select" @keyup.enter="handleClickSearch" clearable size="large">
                            <template #append>
                                <el-button :icon="SearchIcon" @click="handleClickSearch" />
                            </template>
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="flex justify-end">
                <el-select v-model="status" placeholder="Filter by status" style="width: 150px" @change="filterStatus">
                    <el-option v-for="item in listProductStatus" :key="item.value" :label="item.text"
                        :value="item.value" />
                </el-select>
            </div>
            <div>
                <history-product-list :meta="meta" :dataList="listBuyerHistorys" :size="size" :title="getTitle(status)"
                    :isCollapse="isBiddingCollapse" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { getBuyerHistoryList } from '../../../services/auction.service'

const SearchIcon = Search
const router = useRouter()
const route = useRoute()
const searchValue = ref('')
const status = ref(1)
const selectedItem = ref(null)

const meta = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
})


const listBuyerHistorys = ref([])

const listProductStatus = ref([
    { value: 1, text: 'Bidding' },
    { value: 2, text: 'Offers' },
    { value: 3, text: 'Didn\'t win' },
])

const getTitle = (data) => {
    switch (data) {
        case 1:
            return 'Bidding'
        case 2:
            return 'Offers'
        case 3:
            return 'Didn\'t win'
        default:
            return
    }
}

watch(searchValue, async () => {
    await SearchHistory()
})

watch(() => meta.value.pageSize, async (newValue, oldValue) => {
    console.log('old', oldValue, 'new', newValue);
    if (newValue !== oldValue) {
        await SearchHistory()
    }
})

const getHistory = async (currentPage, pageSize, searchQuery, status) => {
    try {
        const res = await getBuyerHistoryList(currentPage, pageSize, searchQuery, status)
        console.log(res)
        listBuyerHistorys.value = res.data.data
        meta.value = res.data.meta
        console.log('list', listBuyerHistorys.value)
    } catch (error) {
        console.log(error)
    }
}

const filterStatus = async (value) => {
    selectedItem.value = value
    status.value = value
    await SearchHistory()
}

const handleClickSearch = () => {
    if (searchValue.value.trim() !== '') {
        console.log(searchValue.value)
        router.push({
            path: '/buyer-history',
            query: { search: searchValue.value.trim() },
        })
    } else {
        const { search, ...queryWithoutSearch } = route.query
        router.push({ path: '/buyer-history', query: queryWithoutSearch })
    }
}

const SearchHistory = async () => {
    try {
        const res = await getBuyerHistoryList(meta.value.currentPage, meta.value.pageSize, searchValue.value, status.value)
        meta.value = res.data.meta
        listBuyerHistorys.value = res.data.data

        const query = {}
        if (searchValue.value) {
            query.search = searchValue.value
        }
        if (status.value) {
            query.status = status.value
        }
        console.log('query1', query)
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

const collapseDataList = (data) => {
    data = !data;
    if (data) {
        meta.value.pageSize = 0
    } else {
        meta.value.pageSize = 5
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
