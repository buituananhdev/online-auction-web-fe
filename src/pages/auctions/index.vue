<template>
    <div v-loading="loading" full-screen="false" class="flex justify-start gap-[16px] min-h-[80vh]">
        <filter-product
            v-if="listCategories.length > 0"
            :listCategories="listCategories"
            :filterProps="filterProps"
            @update:catergoriesFilter="onCategoriesFilterUpdate"
            @update:conditionsValue="onConditionsValueUpdate"
            @update:priceMinFilter="onPriceMinFilterUpdate"
            @update:priceMaxFilter="onPriceMaxFilterUpdate"
            class="w-[260px]"
        />
        <div class=" hihii flex items-center justify-start flex-wrap gap-[16px]">
            <div v-for="(item, index) in listProducts" :key="item.id" class="product-card">
                <product-card :auction="item" />
            </div>
        </div>
        <el-pagination :page-size="meta.pageSize" :pager-count="11" layout="prev, pager, next" :total="meta.total" />
    </div>
</template>
<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getListAuctions } from '../../services/auction.service'
import { getListCategories } from '../../services/category.service'

const route = useRoute()
const loading = computed(() => {
    return !Boolean(listProducts.value.length > 0 && listCategories.value.length > 0)
})
// const loading = ref(true)
const meta = ref({})
const listProducts = ref([])
const listCategories = ref([])
const searchValue = ref('')
const filterProps = ref({})
const getListProduct = async () => {
    const res = await getListAuctions(meta.pageNumber, meta.pageSize)
    listProducts.value = res.data.data
    // console.log(data)
}
const getAllCategories = async () => {
    const res = await getListCategories(meta.pageNumber, meta.pageSize)
    listCategories.value = res.data.data
    console.log(res.data.data)
}

const onCategoriesFilterUpdate = (value) => {
    filterProps.categories = value
    // Có thể thực hiện các xử lý khác tại đây nếu cần
}

const onConditionsValueUpdate = (value) => {
    filterProps.conditions = value
    // Có thể thực hiện các xử lý khác tại đây nếu cần
}

const onPriceMinFilterUpdate = (value) => {
    filterProps.price.min = value
    // Có thể thực hiện các xử lý khác tại đây nếu cần
}

const onPriceMaxFilterUpdate = (value) => {
    filterProps.price.max = value
    // Có thể thực hiện các xử lý khác tại đây nếu cần
}
const refreshData = async () => {
    if (searchValue.value) {
        await Search()
    } else {
        await getListProduct()
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
