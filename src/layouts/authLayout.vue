<template>
    <div v-if="authStore().isLoggedIn" class="flex min-h-screen">
        <!-- <div class="flex flex-col flex-grow bg-[#f4f6f9]">
            <div class="mb-auto flex">
                <div class="w-full mt-[60px] rounded-3xl">
                    <slot></slot>
                </div>
            </div>
        </div> -->
        <el-container>
            <el-aside width="200px">Aside</el-aside>
            <el-container>
                <el-header><the-header /></el-header>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue'
import { authStore } from '@/stores/auth.store'
import { ElContainer, ElHeader, ElAside, ElMain } from 'element-plus'
</script>
