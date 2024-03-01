<template>
    <div v-if="!authStore.isLoggedIn" class="rounded">
        <the-header />
        <slot></slot>
    </div>
</template>
<script setup>
import { authStore } from '@/stores/auth.store'
import TheHeader from '@/components/layouts/TheHeader.vue'
</script>
