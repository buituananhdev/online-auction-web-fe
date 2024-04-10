<template>
    <div class="category-card cursor-pointer my-2">
        <img :src="category.img" alt="" class="rounded-full w-[135px] h-[135px] object-cover">
        <p class="text-center">{{ category.name }}</p>
    </div>
</template>
<script setup>
import { defineProps } from 'vue'

defineProps({
    category: Object,
})
</script>
<style scoped>
.category-card:hover p{
    text-decoration: underline;
}
</style>
