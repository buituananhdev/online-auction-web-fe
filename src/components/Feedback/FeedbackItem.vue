<script setup>
import { computed, defineProps } from 'vue'
import { getTimeDifference } from '../../utils'

defineProps({
    feedbackItem: Object,
})
</script>

<template> 
    <div class="flex items-start gap-4 pb-2 pt-4 border-b">
        <img class="w-[30px] h-[30px] rounded-full" :src="feedbackItem?.fromUser.avatar || 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=mTwok-KpNkoQ7kNvgHHkIu4&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfCt-oNHFsCC1xjcBfzkXmgyxJZInGuYuKKcA5rZwQDiCQ&oe=66400B10'" alt="user avatar">
        <div class="flex flex-col gap-1">
            <span>{{ feedbackItem?.fromUser.fullName }}</span>
            <el-rate style="width: 7px;" disabled v-model="feedbackItem.rating" />
            <span class="text-sm text-[#6C6C6C]">{{ getTimeDifference(feedbackItem?.dateCreated) }}</span>
            <p>{{ feedbackItem?.feedbackMessage }}</p>
        </div>
    </div>
</template>