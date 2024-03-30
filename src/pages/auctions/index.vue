<template>
    <div v-loading="loading" full-screen="false" class="flex justify-start gap-[16px] min-h-[80vh] overfolw-hidden">
        <div class="w-[200px] grow-0 shrink-0" v-show="!loading">
            <VueDatePicker
                @update:model-value="handleFilterchange"
                :time-zone="{ tz: 'Asia/Novosibirsk', offset: 7 }"
                v-model="filter.dateTime"
                placeholder="Select time range"
                range
            />
            {{ filter.dateTime }}
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
                            v-model="filter.price.min"
                            placeholder="Min"
                        />
                        to
                        <el-input type="number" v-model="filter.price.max" placeholder="Max" />
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
        <div class="hihii w-[924px] flex items-center justify-start flex-wrap gap-[16px]">
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

const route = useRoute()
const loading = computed(() => {
    return !Boolean(listProducts.value.length > 0 || listCategories.value.length)
})
const priceFilterType = ref(1)
const isError = ref(false)
const filter = reactive({
    categories: [],
    condition: 0,
    price: {
        min: '',
        max: '',
    },
    dateTime: [],
})
const date = ref()

const listcondition = reactive([
    {
        id: 1,
        name: 'New',
    },
    {
        id: 2,
        name: 'Open box',
    },
    {
        id: 3,
        name: 'Used',
    },
])
const handleFilterchange = async () => {
    alert('hihii')
    await Search()
}
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
const searchValue = ref('')
const meta = ref({
    currentPage: 1,
    totalPage: 1,
    pageSize: 15,
})
const listProducts = ref([])
const listCategories = ref([])
const isEnableButton = computed(() => {
    return !Boolean(filter.price.min || filter.price.max)
})
watch(filter.price, (newVal, oldVal) => {
    isError.value = false
})
const getListProduct = async (
    pageNumber,
    pageSize,
    searchValue,
    condition,
    minPrice,
    maxPrice,
    minEndTime,
    maxEndTime,
    minMaxPrice,
    maxMaxPrice,
) => {
    try {
        console.log('hi')
        console.log("hiiii", minMaxPrice,
            maxMaxPrice,);
        const res = await getListAuctions(
            pageNumber,
            pageSize,
            searchValue,
            condition,
            minPrice,
            maxPrice,
            minEndTime,
            maxEndTime,
            minMaxPrice,
            maxMaxPrice,
        )
        listProducts.value = res.data.data
    } catch (error) {
        console.error(error)
    }
    // console.log(data)
}
const getAllCategories = async () => {
    try {
        const res = await getListCategories(meta.value.pageNumber, meta.value.pageSize)
        listCategories.value = res.data.data
        console.log(res.data.data)
    } catch (error) {
        console.error(error)
    }
}
const appyPriceFilter = () => {
    try {
        if (filter.price.min > filter.price.max) {
            isError.value = true
            return
        } else {
            Search()
        }
    } catch (error) {
        console.error(error)
    }
}
const Search = async () => {
    // console.log('hihiih')
    // console.log('hihiii', priceFilterType.value)
    // console.log('hehehehhe', filter.price.min, filter.price.max)
    // console.log('hhhhhhhh', filter)
    try {
        // console.log('hihieeeeeeeeih')
        let res
        if (priceFilterType.value === 1) {
            console.log('vp day heee')
            res = await getListProduct(
                meta.value.pageNumber,
                meta.value.pageSize,
                searchValue.value,
                filter.condition,
                filter.price.min,
                filter.price.max,
                filter.dateTime[0],
                filter.dateTime[1],
            )
            console.log('vp day heee')
        } else {
            console.log('vp day ha')
            res = await getListProduct(
                meta.value.pageNumber,
                meta.value.pageSize,
                searchValue.value,
                filter.condition,
                '',
                '',
                filter.dateTime[0].toISOString(),
                filter.dateTime[1].toISOString(),
                filter.price.min,
                filter.price.max,
            )
        }
        // console.log('hahah')
        // console.log('meta.value', meta.value)
        meta.value = res.data.meta
        // console.log('qqqq')
        listProducts.value = res.data.data
        // console.log('qqqq')

        const query = {}
        if (searchValue.value) {
            query.search = searchValue.value
        }
        if (filter.condition) {
            query.condition = filter.condition
        }
        if (filter.price.min) {
            query.minPrice = filter.price.min
        }
        if (filter.price.max) {
            query.maxPrice = filter.price.max
        }

        const router = useRouter()
        router.push({ path: `/`, query })
        // console.log('query', query)
        // console.log('fffff')
    } catch (error) {
        // console.log(error)
    }
}
const refreshData = async () => {
    // console.log('filter', !isEmpty(filter.condition));
    // console.log('filter', !filter.price.min);
    // console.log('filter', !filter.price.max);
    // console.log('searchValue.value', !searchValue.value);
    if (searchValue.value || filter.condition || filter.price.min || filter.price.max || filter.dateTime.length > 0) {
        await Search()
    } else {
        await getListProduct(meta.value.pageNumber, meta.value.pageSize)
    }
}
const pageParam = computed(() => {
    return route.query.pageSize
})
const pageSearch = computed(() => {
    return route.query.search
})

onBeforeMount(() => {
    refreshData()
    getAllCategories()
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
