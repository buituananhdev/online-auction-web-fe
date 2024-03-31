<template>
    <div v-if="authStore().isLoggedIn" class="flex min-h-screen">
        <el-container>
            <el-header>
                <the-header>
                    <el-input
                        v-model="searchValue"
                        style="width: 35%; border-radius: 30px"
                        placeholder="Search..."
                        class="input-with-select"
                    >
                        <template #append>
                            <el-button :icon="SearchIcon" />
                        </template>
                    </el-input>
                </the-header>
            </el-header>
            <el-main style="padding-top: 40px; margin: auto; max-width: 1140px; overflow: hidden;">
                <slot :search-value="searchValue" />
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TheHeader from '../components/layouts/TheHeader.vue'
import { authStore } from '../stores/auth.store'
import { Search } from '@element-plus/icons-vue'

const searchValue = ref('')
const SearchIcon = Search
</script>
