<template>
    <div v-loading="loading" full-screen="false" class="flex justify-start gap-[16px] min-h-[80vh] overfolw-hidden">
        <div class="w-[200px] grow-0 shrink-0" v-show="!loading">
            <el-text style="display: inline-block; padding-bottom: 14px;">Time Range</el-text>
            <VueDatePicker
            class="pb-4 border-b"
                :time-zone="{ tz: 'Asia/Novosibirsk', offset: 7 }"
                v-model="filter.dateTime"
                @update:model-value="handleFilterchange"
                placeholder="Select time range"
                range
            />
            <el-form @change="refreshData" :model="filter" label="Filter by" class="">
                <el-form-item label="Category" class="border-b" prop="type">
                    <el-checkbox-group class="flex flex-col gap-1 mt-2 pb-2" v-model="filter.categories">
                        <el-checkbox
                            class="pl-2"
                            v-for="(item, index) in listCategories"
                            :key="item.id"
                            :value="item.id"
                            name="type"
                            >{{ item.categoryName }}</el-checkbox
                        >
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="Condition" prop="type" class="mt-3 border-b">
                    <el-radio-group
                        class="flex flex-col gap-1"
                        style="align-items: flex-start"
                        v-model="filter.condition"
                    >
                        <el-radio :value="1">New</el-radio>
                        <el-radio :value="2">Open box</el-radio>
                        <el-radio :value="3">Used</el-radio>
                        <el-radio :value="0">None</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form style="position: relative" class="border-b">
                <el-form-item label="Price Range" prop="type" class="mt-3">
                    <div class="mt-3 flex gap-2">
                        <el-input
                            type="number"
                            controls="false"
                            style="border-radius: 30px"
                            v-model="filter.price.minCurrent"
                            placeholder="Min"
                        />
                        to
                        <el-input type="number" v-model="filter.price.maxCurrent" placeholder="Max" />
                    </div>
                    <p v-show="isError" class="mx-1 text-xs text-[red] pt-1 px-2 text-center">
                        Please fill in the appropriate price range
                    </p>
                </el-form-item>
                <el-form-item style="position: absolute; top: 5px; right: 0px">
                    <el-select v-model="priceFilterType" placeholder="Select" size="small" style="width: 80px">
                        <el-option v-for="item in options" :key="item.id" :label="item.context" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item class="border-b">
                    <el-button type="primary" style="width: 200px" :disabled="isEnableButton" @click="appyPriceFilter"
                        >Apply</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="hihii w-[924px] flex items-start justify-start flex-wrap gap-[16px]">
            <div
                v-if="listProducts.length > 0"
                v-for="(item, index) in listProducts"
                :key="item.id"
                class="product-card"
            >
                <product-card :auction="item" />
            </div>
            <div v-else class="w-full">
                <el-empty description="No data" />
            </div>
        </div>
        <!-- <el-pagination
            :page-size="meta.pageSize"
            :current-page="meta.currentPage"
            :pager-count="11"
            layout="prev, pager, next"
            :total="meta.total"
            :hide-on-single-page="true"
        /> -->
    </div>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref, defineProps, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getListAuctions } from '../../services/auction.service'
import { getListCategories } from '../../services/category.service'

const router = useRouter()
const route = useRoute()

const priceFilterType = ref(1)
const isError = ref(false)
let filter = reactive({
    categories: [],
    condition: 0,
    price: {
        minCurrent: '',
        maxCurrent: '',
        minMax: '',
        maxMax: '',
    },
    dateTime: [],
})
const options = ref([
    {
        id: 1,
        context: 'current',
    },
    {
        id: 2,
        context: 'sell',
    },
])
const meta = ref({
    currentPage: 1,
    totalPage: 1,
    pageSize: 15,
})
const listProducts = ref([])
const listCategories = ref([])
const loading = computed(() => {
    return !Boolean(listProducts.value.length > 0 || listCategories.value.length)
})
const searchValue = computed(() => {
    return route.query.search
})
const isEnableButton = computed(() => {
    return !Boolean(filter.price.minCurrent || filter.price.maxCurrent)
})

watch(filter.price, () => {
    isError.value = false
})
watch(searchValue, async () => {
    await Search()
})
const handleFilterchange = async (modelData) => {
    filter.dateTime = modelData
    await Search()
}
const getListProduct = async (
    pageNumber,
    pageSize,
    searchValue,
    condition,
    minPrice,
    maxPrice,
    minMaxPrice,
    maxMaxPrice,
    minEndTime,
    maxEndTime,
) => {
    try {
        const res = await getListAuctions(
            pageNumber,
            pageSize,
            searchValue,
            condition,
            minPrice,
            maxPrice,
            minMaxPrice,
            maxMaxPrice,
            minEndTime,
            maxEndTime,
        )
        listProducts.value = res.data.data
    } catch (error) {
        console.log(error)
    }
}
const getAllCategories = async () => {
    try {
        const res = await getListCategories(meta.value.pageNumber, meta.value.pageSize)
        listCategories.value = res.data.data
        console.log(res.data.data)
    } catch (error) {
        console.log(error)
    }
}
const appyPriceFilter = async () => {
    try {
        if(!filter.price.minCurrent || !filter.price.maxCurrent) {
            isError.value = false
        } else if (filter.price.minCurrent > filter.price.maxCurrent || filter.price.minMax > filter.price.maxMax) {
            isError.value = true
            return
        }
        if (priceFilterType.value === 2) {
            filter.price.minMax = filter.price.minCurrent
            filter.price.maxMax = filter.price.maxCurrent
            filter.price.maxCurrent = ''
            filter.price.minCurrent = ''
            await Search()
        } else {
            filter.price.minMax = ''
            filter.price.maxMax = ''
            await Search()
        }
    } catch (error) {
        console.log(error)
    }
}
const Search = async () => {
    try {
        console.log('hihieeeeeeeeih')
        console.log('filter', filter.price);
        filter.dateTime.forEach(date => {
            if(date) {
                date = date.toISOString()
            }
        })
        const res = await getListAuctions(
            meta.value.pageNumber,
            meta.value.pageSize,
            searchValue.value,
            filter.condition,
            filter.price.minCurrent,
            filter.price.maxCurrent,
            filter.price.minMax,
            filter.price.maxMax,
            filter.dateTime[0],
            filter.dateTime[1],
        )
        console.log('hahah')
        // console.log('meta.value', meta.value)
        meta.value = res.data.meta
        // console.log('qqqq')
        listProducts.value = res.data.data
        console.log('qqqq')

        const query = {}
        if (searchValue.value) {
            query.search = searchValue.value
        }
        console.log(filter)
        if (filter.condition) {
            query.condition = filter.condition
        }
        if (filter.price.minCurrent) {
            query.minCurPrice = filter.price.minCurrent
        }
        if (filter.price.maxCurrent) {
            query.maxCurPrice = filter.price.maxCurrent
        }
        if (filter.price.minMax) {
            query.minMaxPrice = filter.price.minMax
        }
        if (filter.price.maxMax) {
            query.maxMaxPrice = filter.price.maxMax
        }
        if (filter.dateTime[0]) {
            query.startTime = filter.dateTime[0]
        }
        if (filter.price.maxMax) {
            query.endTime = filter.dateTime[1]
        }
        console.log('query', query)
        router.push({ path: `/list-auctions`, query })
        console.log('query', query)
        // console.log('fffff')
    } catch (error) {
        // console.log(error)
    }
}
const refreshData = async () => {
    if (
        searchValue.value ||
        filter.condition ||
        filter.price.minCurrent ||
        filter.price.maxCurrent ||
        filter.dateTime.length > 0
    ) {
        await Search()
    } else {
        await getListProduct(meta.value.pageNumber, meta.value.pageSize)
    }
}
const getQueryValue = () => {
    if(route.query.condition) {
        filter.condition = parseInt(route.query.condition) 
    }
    if(route.query.minCurPrice) {
        filter.price.minCurrent = parseInt(route.query.minCurPrice) 
    }
    if(route.query.maxCurPrice) {
        filter.price.maxCurrent = parseInt(route.query.maxCurPrice) 
    }
    if(route.query.minMaxPrice) {
        filter.price.minMax = parseInt(route.query.minMaxPrice) 
    }
    if(route.query.maxMaxPrice) {
        filter.price.maxMax = parseInt(route.query.maxMaxPrice) 
    }
    if(route.query.startTime) {
        filter.dateTime[0] = parseInt(route.query.startTime) 
    }
    if(route.query.endTime) {
        filter.dateTime[1] = parseInt(route.query.endTime) 
    }
}
onBeforeMount(async () => {
    getQueryValue()
    await refreshData()
    await getAllCategories()
})
</script>
<style scoped lang="scss">
.product-card {
    width: calc((100% - 48px) / 4);
}
.hihii {
    color: $color-primary;
}
</style>
