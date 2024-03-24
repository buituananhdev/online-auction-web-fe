<template>
    <div v-if="authStore().isLoggedIn" class="flex min-h-screen">
        <el-container>
            <el-header><the-header /></el-header>
            <el-main style="padding-top: 40px; margin: auto; max-width: 1140px;"><slot/></el-main>
        </el-container>
    </div>
</template>

<script setup>
import TheHeader from '../components/layouts/TheHeader.vue'
import { authStore } from '../stores/auth.store'
</script>
