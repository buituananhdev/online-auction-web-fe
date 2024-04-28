<template>
  <div v-loading="loading" class="w-[1100px]">
    <div class="w-full bg-zinc-50 rounded-lg pt-5 pl-2">
        <div class="flex justify-between gap-5 mx-5 py-6">
            <span class="font-bold text-2xl">Sold</span>
            <div class="w-1/2">
                <el-input
                    v-model="searchValue"
                    style="border-radius: 30px; height: 40px;"
                    placeholder="Search..."
                    class="input-with-select"
                    @keyup.enter="handleClickSearch"
                    clearable
                >
                    <template #append>
                        <el-button :icon="SearchIcon" @click="handleClickSearch" />
                    </template>
                </el-input>
            </div>
        </div>

        <div class="my-5 flex items-center gap-5 pl-8 pb-[10px]">
            <div v-for="item in listProductStatus" :key="item.value" class="">
                <span class="px-8 py-2 border-gray-500 border-[1px] rounded-full font-semibold bg-slate-100 hover:cursor-pointer hover:bg-slate-200"> {{ item.text }} </span>
            </div>
        </div>

        <div class="mt-10 mx-5 flex flex-col gap-5">
            <div class="mb-4 flex justify-between items-center">
                <span class="font-bold text-xl">Orders</span>
                <el-button type="primary" style="font-size: medium;" round size="large" @click="createAuction">Create Auction</el-button>
            </div>
            <div v-if="listSellerHistorys.length" class="w-full flex flex-col items-center justify-center">
                <div v-for="item in listSellerHistorys" :key="item.id" class="w-full flex items-center justify-center mb-16">
                    <history-card :auction="item" />
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

const searchValue = ref('')
const SearchIcon = Search
const router = useRouter()
const route = useRoute()

const meta = ref({
    currentPage: 1,
    totalPage: 1,
    pageSize: 4,
})



const listSellerHistorys = ref([])
const listProductStatus = ref([
    { value: 1, text: 'Available'},
    { value: 2, text: 'Sold'},
    { value: 3, text: 'Deleted'},
    { value: 4, text: 'Canceled'},
    { value: 5, text: 'Pending Publish'}
])

const loading = computed(() => {
    return !Boolean(listSellerHistorys.value.length > 0 )
})

// const searchValue = computed(() => {
//     return route.query.search
// })

watch(searchValue, async () => {
    await Search()
})


const getHistory = async () => {
    try {
        const res = await getSellerHistory()
        console.log(res);
        listSellerHistorys.value = res.data
        meta.value = res.data.meta
        console.log('list', listSellerHistorys);
        
        // console.log('meta', meta)
    } catch (error) {
        console.log(error)
    }
}

const createAuction = () => {
    router.push({ path: '/create-auction'})
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

const refreshData = async () => {
    await getHistory()
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