<template>
    <div v-if="authStore().isLoggedIn" class="flex min-h-screen">
        <el-container>
            <el-header><the-header /></el-header>
            <el-main>Main</el-main>
        </el-container>
    </div>
</template>

<script setup>
import TheHeader from '../components/layouts/TheHeader.vue'
import { authStore } from '../stores/auth.store'
</script>
