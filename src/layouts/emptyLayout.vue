<template>
    <div v-if="!authStore.isLoggedIn" class="rounded">
        <el-container>
            <el-header>
                <the-header>
                    <el-input
                        v-model="searchValue"
                        style="width: 35%; border-radius: 30px"
                        placeholder="Search..."
                        class="input-with-select"
                        @keyup.enter="handleClickSearch"
                    >
                        <template #append>
                            <el-button :icon="SearchIcon" @click="handleClickSearch" />
                        </template>
                    </el-input>
                </the-header>
            </el-header>
            <el-main style="padding-top: 40px;background-color: #ffff; margin: auto; max-width: 1140px; overflow: hidden; min-width: 1100px">
                <slot />
            </el-main>
            <el-footer style="padding: 0;"><the-footer/></el-footer>
        </el-container>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import TheHeader from '../components/Layout/TheHeader.vue'
import TheFooter from '../components/Layout/TheFooter.vue'
import { authStore } from '../stores/auth.store'
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
onMounted(() => {
    if (route.query.search) {
        searchValue.value = route.query.search.toString()
    }
})
</script>
