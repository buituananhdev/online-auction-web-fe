<template>
    <div>
        <el-form :model="filter" label="Filter by" class="">
            <el-form-item label="Category" prop="type">
                <el-checkbox-group
                    class="flex flex-col gap-1 mt-2 pb-2 border-b"
                    :value="filter.categories"
                    @input="updateCategoriesFilter"
                >
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
            <el-form-item label="Condition" prop="type" class="mt-3">
                <el-checkbox-group
                    class="flex flex-col gap-1 mt-2 pb-2 border-b"
                    :value="filter.conditions"
                    @input="updateConditionsValue"
                >
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
            <el-form-item label="Price Range" prop="type" class="mt-3">
                <div class="mt-3 flex gap-2">
                    <el-input :value="filter.price.min" @input="updatePriceMinFilter" placeholder="Min" />
                    to
                    <el-input :value="filter.price.max" @input="updatePriceMaxFilter" placeholder="Max" />
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive } from 'vue'

const { emit } = defineEmits()

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

const updateCategoriesFilter = (value) => {
    emit('update:catergoriesFilter', value)
}

const updateConditionsValue = (value) => {
    emit('update:conditionsValue', value)
}

const updatePriceMinFilter = (value) => {
    emit('update:priceMinFilter', value)
}

const updatePriceMaxFilter = (value) => {
    emit('update:priceMaxFilter', value)
}

defineProps({
    listCategories: Array,
    filterProps: Object,
})
</script>
<style>
.el-form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start
}

</style>