<template>
    <div v-loading="loading" full-screen="false" class="flex justify-start gap-[16px] min-h-[80vh] overfolw-hidden">
        <div class="w-[200px] grow-0 shrink-0" v-show="!loading">
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
                    <el-checkbox-group class="flex flex-col gap-1 mt-2 pb-2" v-model="filter.conditions">
                        <el-checkbox
                            class="pl-2"
                            v-for="(item, index) in listConditions"
                            :key="item.id"
                            :value="item.id"
                            name="type"
                            >{{ item.name }}</el-checkbox
                        >
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <el-form>
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
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 200px" :disabled="isEnableButton" @click="refreshData"
                        >Apply</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
        <div class="hihii w-[924px]  flex items-center justify-start flex-wrap gap-[16px]">
            <div v-if="listProducts.length > 0" v-for="(item, index) in listProducts" :key="item.id" class="product-card">
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
import { computed, onBeforeMount, reactive, ref, defineProps } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getListAuctions } from '../../services/auction.service'
import { getListCategories } from '../../services/category.service'

const route = useRoute()
const router = useRouter()
const loading = computed(() => {
    return !Boolean(listProducts.value.length > 0 || listCategories.value.length)
})

const filter = reactive({
    categories: [],
    conditions: [],
    price: {
        min: '',
        max: '',
    },
})

const listConditions = reactive([
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

const searchValue = ref('')
const meta = ref({
    currentPage: 1,
    totalPage: 1,
    pageSize: 15,
})
const listProducts = ref([])
const listCategories = ref([])
// const props = defineProps({
//     searchValue: {
//         type: String,
//         required: true,
//     },
// })

const isEnableButton = computed(() => {
    return !Boolean(filter.price.min || filter.price.max)
})
const getListProduct = async (pageNumber, pageSize, conditions, minPrice, maxPrice) => {
    try {
        const res = await getListAuctions(pageNumber, pageSize, conditions, minPrice, maxPrice)
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
const Search = async () => {
    // console.log('hihiih')
    try {
        // console.log('hihieeeeeeeeih')
        const res = await getListProduct(
            meta.value.pageNumber,
            meta.value.pageSize,
            searchValue.value,
            filter.conditions,
            filter.price.min,
            filter.price.max
        )
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
        if (filter.conditions) {
            query.condition = filter.conditions
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
    // console.log('filter', !isEmpty(filter.conditions));
    // console.log('filter', !filter.price.min);
    // console.log('filter', !filter.price.max);
    // console.log('searchValue.value', !searchValue.value);

    if (searchValue.value || filter.conditions.length > 0 || filter.price.min || filter.price.max) {
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
