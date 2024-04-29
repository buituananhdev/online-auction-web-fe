<template>
    <el-tooltip class="box-item" effect="light" content="Left Center prompts info" placement="right" show-after="400">
        <template #content>
            <div class="w-[280px] min-h-[340px] flex flex-col gap-4 p-3">
                <div>
                    <b class="text-lg">{{ auction.productName }}</b>
                    <div class="flex justify-between items-center">
                        <div class="flex gap-2 items-center">
                            <el-text class="border rounded-md text-xs" style="padding: 0px 10px">{{
                                converConditionText(auction.condition)
                            }}</el-text>
                            <el-text class="border rounded-md text-xs" style="padding: 0px 10px">{{
                                auction.category.categoryName
                            }}</el-text>
                        </div>
                        <el-text class="text-xs" style="padding: 0px 10px">Views: {{ auction.viewCount }}</el-text>
                    </div>
                    <p style="font-size: 12px">Time left {{ convertISOToRegularTime(auction.endTime) }}</p>
                    <div class="flex justify-between items-center">
                        <p style="font-size: 14px; margin-bottom: 6px">
                            Owner: <b>{{ auction.user.fullName }}</b>
                        </p>
                        <el-rate
                            v-model="auction.user.ratings.avarageRating"
                            disabled
                            :colors="colors"
                            score-template="({auction.user.ratings.totalRatings})"
                        />
                    </div>
                    <p class="text-[16px]">About product:</p>
                    <ul class="pl-4 list-disc">
                        <li class="text-[14px]">
                            {{ auction.canReturn ? 'Can be returned' : ' Cannot be returned ' }}
                        </li>
                        <li class="text-[14px]">{{ auction.description }}</li>
                    </ul>
                </div>
                <div class="footer flex gap-3 items-center">
                    <el-button type="primary" style="width: 80%; color: #ffff" size="large" color="#409EFF"
                        >Place bid</el-button
                    >
                    <div
                        @click="() => (isLike = !isLike)"
                        class="image border rounded-full p-2 border-black border-[0.7px] cursor-pointer"
                    >
                        <img
                            class="hover:opacity-40"
                            v-if="isLike"
                            src="../../assets/icons/heart-icon.svg"
                            width="25"
                            alt=""
                        />
                        <img v-else src="../../assets/icons/full-heart-icon.svg" width="25" alt="" />
                    </div>
                </div>
            </div>
        </template>
        <el-card
            style="height: 405px; margin-bottom: 20px; cursor: pointer; width: 285px"
            @click="goToDetail(auction.id)"
            onmouseover="this.style.borderColor='#409EFF'; this.style.transform='translateY(-4px)';"
            onmouseout="this.style.borderColor='white'; this.style.transform='translateY(0)';"
        >
            <div class="p-6">
                <img
                    src="https://queenmobile.store/wp-content/uploads/2023/12/5-17-image-47551.jpg"
                    style="width: 230px; height: 230px"
                />
            </div>
            <template #footer>
                <div class="flex flex-col items-start gap-1 p-1">
                    <div class="flex justify-between w-full">
                        <p class="font-bold text-lg">${{ auction.currentPrice }}</p>
                        <el-text style="font-size: 13px; display: inline-block">{{ auction.bidCount }} bids</el-text>
                    </div>
                    <el-rate
                            v-model="auction.user.ratings.avarageRating"
                            disabled
                            style="height: 20px"
                            :colors="colors"
                            score-template="({auction.user.ratings.totalRatings})"
                        />
                    <span class="w-full truncate">${{ auction.productName }}</span>
                    <p truncated style="font-size: 13px"
                        >Time left {{ convertISOToRegularTime(auction.endTime) }}</p
                    >
                </div>
            </template>
        </el-card>
    </el-tooltip>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
defineProps({
    auction: Object,
})

const router = useRouter()
const isLike = ref(false)

const convertISOToRegularTime = (isoTimeString) => {
    const date = new Date(isoTimeString)

    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    // const ampm = hours >= 12 ? 'PM' : 'AM';
    // const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const year = date.getFullYear()

    return `${hours}:${minutes} -  ${month} ${day}, ${year}`
}
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const converConditionText = (id) => {
    switch (id) {
        case 1:
            return 'New'
        case 2:
            return 'Open box'
        case 3:
            return 'Used'
        default:
            return
    }
}
const goToDetail = (id) => {
    console.log('hehehe')
    router.push(`/auctions/${id}`)
}
</script>
<style>
.el-card__body {
    padding: 0;
}
.el-card__footer {
    padding: 8px 12px;
}
</style>
<style scoped lang="scss">

</style>
