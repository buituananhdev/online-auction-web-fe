<template>
    <div class="rounded">
        <el-header>
                <the-header>
                    <el-input v-model="searchValue" style="width: 35%; border-radius: 30px" placeholder="Search..."
                        class="input-with-select" @keyup.enter="handleClickSearch">
                        <template #append>
                            <el-button :icon="SearchIcon" @click="handleClickSearch" />
                        </template>
                    </el-input>
                </the-header>
            </el-header>
        <slot/>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const searchValue = ref('')
const SearchIcon = Search
const router = useRouter()
const route = useRoute()
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

onMounted(async () => {
    if (route.query.search) {
        searchValue.value = route.query.search.toString()
    }
})
</script>
