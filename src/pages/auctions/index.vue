<template>
    <div v-loading="loading" full-screen="false"
        class="flex justify-start gap-[16px] min-h-[80vh] overfolw-hidden min-w-[800px]">
        <div class="w-[200px] grow-0 shrink-0" v-show="!loading">
            <el-form @change="refreshData" :model="filter" label="Filter by" class="relative">
                <el-form-item label="Category" class="border-b" prop="type">
                    <el-checkbox-group class="flex flex-col gap-1 mt-2 pb-2" v-model="filter.categories">
                        <el-checkbox class="pl-2" v-for="item in listCategories" :key="item.id" :value="item.id"
                            name="type">{{ item.categoryName }}</el-checkbox>
                    </el-checkbox-group>
                    <div class="flex justify-end w-full gap-2">
                        <span class="text-xs text-[#505050] cursor-pointer pb-2 hover:underline" @click="categoryMeta.pageSize = 3"
                            v-show="categoryMeta.pageSize > 3">Collapse</span>
                        <span class="text-xs text-[#409EFF] cursor-pointer pb-2 hover:underline" @click="categoryMeta.pageSize += 3"
                            v-show="categoryMeta.pageSize < categoryMeta.totalPages * categoryMeta.pageSize">Load more</span>
                    </div>
                </el-form-item>
                <el-form-item label="Condition" prop="type" class="mt-3 border-b">
                    <el-checkbox-group class="flex flex-col gap-1 mt-2 pb-2" v-model="filter.conditions">
                        <el-checkbox class="pl-2" v-for="item in conditionsList" :key="item.id" :value="item.id"
                            name="type">{{ item.text }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <el-form style="position: relative" class="border-b">
                <el-form-item label="Current Price Range" prop="type" class="mt-3">
                    <div class="mt-3 flex gap-2">
                        <el-input type="number" controls="false" style="border-radius: 30px"
                            v-model="filter.currentPrice.min" placeholder="Min" />
                        to
                        <el-input type="number" v-model="filter.currentPrice.max" placeholder="Max" />
                    </div>
                    <p v-show="isCurrentError" class="mx-1 text-xs text-[red] pt-1 px-2 text-center">
                        Please fill in the appropriate price range
                    </p>
                </el-form-item>
                <el-form-item class="border-b">
                    <el-button type="primary" style="width: 200px" :disabled="isEnableCurrentButton"
                        @click="appyPriceFilter">Apply</el-button>
                </el-form-item>
            </el-form>
            <el-form style="position: relative" class="border-b">
                <el-form-item label="Instant Purchase Price Range" prop="type" class="mt-3">
                    <div class="mt-3 flex gap-2">
                        <el-input type="number" controls="false" style="border-radius: 30px"
                            v-model="filter.sellPrice.min" placeholder="Min" />
                        to
                        <el-input type="number" v-model="filter.sellPrice.max" placeholder="Max" />
                    </div>
                    <p v-show="isError" class="mx-1 text-xs text-[red] pt-1 px-2 text-center">
                        Please fill in the appropriate price range
                    </p>
                </el-form-item>
                <el-form-item class="border-b">
                    <el-button type="primary" style="width: 200px" :disabled="isEnableButton"
                        @click="appyPriceFilter">Apply</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="min-w-[900px]">
            <div v-if="listProducts.length" class="list-product relative min-h-[800px] mb-10">
                <div v-for="item in listProducts" :key="item.id">
                    <product-card :auction="item" />
                </div>
                <div class="flex justify-end w-full absolute bottom-[-40px] right-0">
                    <el-pagination v-show="meta.totalPages > 1" v-model:current-page="meta.currentPage" background
                        layout="prev, pager, next" :total="meta.totalPages * meta.pageSize" />
                </div>
            </div>
            <div v-else class="w-full">
                <el-empty description="No data" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, defineProps, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getListAuctions } from '../../services/auction.service'
import { getListCategories } from '../../services/category.service'

const router = useRouter()
const route = useRoute()
const isError = ref(false)
const isCurrentError = ref(false)
let filter = reactive({
    categories: [],
    conditions: [],
    currentPrice: {
        min: '',
        max: '',
    },
    sellPrice: {
        min: '',
        max: '',
    },
})
const conditionsList = ref([
    {
        id: 1,
        text: 'New',
    },
    {
        id: 2,
        text: 'Open box',
    },
    {
        id: 3,
        text: 'Used',
    },
])
const meta = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 9,
})

const categoryMeta = ref({
    currentPage: 1,
    totalPages: 1,
    pageSize: 3,
})
const listProducts = ref([])
const listCategories = ref([])
const loading = computed(() => {
    return !Boolean(listProducts.value.length > 0 || listCategories.value.length)
})
const searchValue = computed(() => {
    return route.query.search
})
const isEnableCurrentButton = computed(() => {
    return !Boolean(filter.currentPrice.min || filter.currentPrice.max)
})
const isEnableButton = computed(() => {
    return !Boolean(filter.sellPrice.min || filter.sellPrice.max)
})

watch(filter.sellPrice, () => {
    isError.value = false
})
watch(filter.currentPrice, () => {
    isCurrentError.value = false
})
watch(searchValue, async () => {
    await Search()
})

watch(() => meta.value.currentPage, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await Search()
    }
})

watch(() => categoryMeta.value.pageSize, async (newValue, oldValue) => {
    if (newValue !== oldValue) {
        await getAllCategories()
    }
})

const handleFilterchange = async (modelData) => {
    await Search()
}

const getListProduct = async (
    currentPage,
    pageSize,
    searchValue,
    categoriesId,
    conditions,
    minPrice,
    maxPrice,
    minMaxPrice,
    maxMaxPrice,
    minEndTime,
    maxEndTime,
) => {
    try {
        const res = await getListAuctions(
            currentPage,
            pageSize,
            searchValue,
            categoriesId,
            conditions,
            minPrice,
            maxPrice,
            minMaxPrice,
            maxMaxPrice,
            minEndTime,
            maxEndTime,
        )
        listProducts.value = res.data.data
        console.log('list', listProducts.length)
        router.replace({ query: {} });
        meta.value = res.data.meta
        console.log('neta', meta)
    } catch (error) {
        console.log(error)
    }
}

const getAllCategories = async () => {
    try {
        const res = await getListCategories(categoryMeta.value.currentPage, categoryMeta.value.pageSize)
        listCategories.value = res.data.data
        categoryMeta.value = res.data.meta
        console.log(res.data.data)
    } catch (error) {
        console.log(error)
    }
}
const appyPriceFilter = async () => {
    try {
        console.log(filter)
        if (filter.sellPrice.max || filter.sellPrice.min) {
            if (parseFloat(filter.sellPrice.min) > parseFloat(filter.sellPrice.max)) {
                isError.value = true
                return
            }
        }
        if (filter.currentPrice.min || filter.currentPrice.max) {
            if (parseFloat(filter.currentPrice.min) > parseFloat(filter.currentPrice.max)) {
                isCurrentError.value = true
                return
            }
        }
        await refreshData()
    } catch (error) {
        console.log(error)
    }
}
const Search = async () => {
    try {
        const res = await getListAuctions(
            meta.value.currentPage,
            meta.value.pageSize,
            searchValue.value,
            filter.categories,
            filter.conditions,
            filter.currentPrice.min,
            filter.currentPrice.max,
            filter.sellPrice.min,
            filter.sellPrice.max,
        )
        console.log('hahah')
        meta.value = res.data.meta
        console.log('meta.value', meta.value)
        // console.log('qqqq')
        listProducts.value = res.data.data
        const query = {}
        if (searchValue.value) {
            query.search = searchValue.value
        }
        console.log(filter.conditions)
        if (filter.conditions && filter.conditions.length) {
            query.conditions = filter.conditions.join(',')
        }
        if (filter.currentPrice.min) {
            query.minCurPrice = filter.currentPrice.min
        }
        if (filter.currentPrice.max) {
            query.maxCurPrice = filter.currentPrice.max
        }
        if (filter.sellPrice.min) {
            query.minMaxPrice = filter.sellPrice.min
        }
        if (filter.sellPrice.max) {
            query.maxMaxPrice = filter.sellPrice.max
        }
        console.log('filter.categories.length', filter.categories.length);
        if (filter.categories && filter.categories.length) {
            query.categories = filter.categories.join(',')
        } else {
            console.log('delete');
            delete query.categories
        }
        console.log('query', query)
        router.push({ path: `/auctions`, query })
        console.log('query', query)
    } catch (error) {
        console.log(error)
    }
}
const refreshData = async () => {
    if (
        searchValue.value ||
        filter.conditions.length ||
        filter.currentPrice.min ||
        filter.currentPrice.max ||
        filter.categories.length > 0
    ) {
        await Search()
    } else {
        await getListProduct(meta.value.currentPage, meta.value.pageSize)
    }
}
const getQueryValue = () => {
    if (router.currentRoute.value.query.conditions) {
        filter.conditions = router.currentRoute.value.query.conditions
            .split(',')
            .map((condition) => parseInt(condition))
    }
    if (router.currentRoute.value.query.categories) {
        filter.categories = router.currentRoute.value.query.categories.split(',').map((category) => parseInt(category))
    }
    if (route.query.minCurPrice) {
        filter.currentPrice.min = parseInt(route.query.minCurPrice)
    }
    if (route.query.maxCurPrice) {
        filter.currentPrice.max = parseInt(route.query.maxCurPrice)
    }
    if (route.query.minMaxPrice) {
        filter.sellPrice.min = parseInt(route.query.minMaxPrice)
    }
    if (route.query.maxMaxPrice) {
        filter.sellPrice.max = parseInt(route.query.maxMaxPrice)
    }
    console.log('init filter', filter)
}

onBeforeMount(async () => {
    getQueryValue()
    await refreshData()
    await getAllCategories()
})
</script>
<style scoped lang="scss">

.list-product {
    color: $color-primary;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 20px;
}
</style>
