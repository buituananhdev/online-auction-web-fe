<template>
    <component :is="layout">
        <router-view />
    </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
const route = useRoute()
const layout = computed(() => {
    console.log('route', route)
    return (route.meta.layout || 'empty') + '-layout'
})
</script>
