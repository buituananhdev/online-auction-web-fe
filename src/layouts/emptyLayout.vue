<template>
    <div v-if="!authStore.isLoggedIn" class="rounded">
        <slot></slot>
    </div>
</template>
<script setup>
import { authStore } from '../stores/auth.store'
</script>
