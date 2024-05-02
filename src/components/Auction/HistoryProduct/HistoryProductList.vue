<template>
    <div class="flex flex-col border-b py-8">
        <div class="pb-8 flex justify-between items-center">
            <span class="font-semibold text-xl">{{ title }}</span>
            <div class="p-1 rounded-full cursor-pointer" @click="toggleHiddenData" v-show="dataList.length">
                <Icon
                    :icon="!isCollapse ? 'material-symbols:keyboard-arrow-down-rounded' : 'material-symbols:keyboard-arrow-up-rounded'"
                    class="w-[24px] h-[24px]" 
                />
            </div>
        </div>
        <p class="text-center font-semibold">{{ title === 'Bidding' ? 'You are not bidding on any items.' : title === 'Offers' ? 'You don\'t have any offers now.' : 'You don\'t have any items to display.' }}</p>
        <div v-show="!isCollapse" class="w-full flex flex-col items-center justify-center gap-4 relative pb-16">
            <div v-for="item in dataList" :key="item.id" class="w-full flex items-center justify-center">
                <history-card :auction="item" />
            </div>
            <div class="flex justify-end w-full absolute bottom-0 right-0 gap-3">
                <span class="text-sm underline text-[#409EFF] cursor-pointer" @click="meta.pageSize += size"
                    v-show="meta.pageSize < meta.totalPages * meta.pageSize">Load more</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref } from 'vue'

defineProps({
    dataList: {
        type: Array,
        required: true,
        default: []
    },
    size: {
        type: Number,
        default: 5
    },
    title: {
        type: String,
        required: true
    },
    meta: {
        type: Object,
        default: {
            currentPage: 1,
            totalPages: 1,
            pageSize: 5
        }
    }
})
const isCollapse = ref(false)

const toggleHiddenData = () => {
    isCollapse.value = !isCollapse.value
}

</script>
