<template>
    <div class="category-card cursor-pointer my-2">
        <img :src="category.imageUrl || 'https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'" alt="" class="rounded-full w-[135px] h-[135px] object-cover">
        <p class="text-center">{{ category.categoryName }}</p>
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
    font-weight: 550;
    color: rgb(74, 74, 74);
}
</style>
