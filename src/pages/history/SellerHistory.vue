<template>
  <div v-loading="loading" class="w-[1100px]">
    <div class="w-full bg-slate-200 rounded-lg">
        <div class="flex justify-between gap-5 mx-5 pt-5">
            <span class="font-bold text-3xl">Sold</span>
            <div class="w-1/2">
                <el-input
                    v-model="searchValue"
                    style="border-radius: 30px;"
                    placeholder="Search..."
                    class="input-with-select"
                    @keyup.enter="handleClickSearch"
                >
                    <template #append>
                        <el-button :icon="SearchIcon" @click="handleClickSearch" />
                    </template>
                </el-input>
            </div>
        </div>

        <div class="mt-5 mx-5 flex flex-col gap-5">
            <span class="font-semibold text-xl">Order</span>
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
const loading = computed(() => {
    return !Boolean(listSellerHistorys.value.length > 0 )
})
// const searchValue = computed(() => {
//     return route.query.search
// })

// watch(searchValue, async () => {
//     await Search()
// })


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
</style>