<script setup>
import { computed, defineProps } from 'vue'
import { getTimeDifference } from '../../utils'

defineProps({
    feedbackItem: Object,
})

</script>

<template> 
    <div class="flex items-start gap-4 pb-2 pt-4 border-b">
        <img class="w-[30px] h-[30px] rounded-full" :src="feedbackItem?.fromUser.avatar || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg'" alt="user avatar">
        <div class="flex flex-col gap-1">
            <span>{{ feedbackItem?.fromUser.fullName }}</span>
            <el-rate style="width: 7px;" disabled v-model="feedbackItem.rating" />
            <span class="text-sm text-[#6C6C6C]">{{ getTimeDifference(feedbackItem?.dateCreated) }}</span>
            <p>{{ feedbackItem?.feedbackMessage }}</p>
        </div>
    </div>
</template>