<script setup>
import { computed, defineProps } from 'vue'
import { getTimeDifference } from '../../utils'

defineProps({
    feedbackItem: Object,
})

</script>

<template> 
    <div class="flex items-start gap-4 pb-2 pt-4 border-b">
        <img class="w-[30px] h-[30px] rounded-full" :src="feedbackItem?.fromUser.avatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'" alt="user avatar">
        <div class="flex flex-col gap-1">
            <span>{{ feedbackItem?.fromUser.fullName }}</span>
            <el-rate style="width: 7px;" disabled v-model="feedbackItem.rating" />
            <span class="text-sm text-[#6C6C6C]">{{ getTimeDifference(feedbackItem?.dateCreated) }}</span>
            <p>{{ feedbackItem?.feedbackMessage }}</p>
        </div>
    </div>
</template>