<template>
    <div class="w-full h-[80%] gap-4 flex flex-col">
        <div class="h-fit font-medium bg-[#ffff] rounded-2xl border">
            <div class="flex gap-8 p-6 items-center">
                <div class="demo-image__preview">
                    <el-image
                        style="width: 200px; height: 200px; border-radius: 16px"
                        :src="url"
                        :zoom-rate="1.2"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="srcList"
                        :initial-index="4"
                        fit="cover"
                    />
                </div>
                <div class="flex items-start justify-between w-full">
                    <div class="flex flex-col gap-2 mt-1 text-sm mr-6">
                        <div class="w-full flex items-center justify-between">
                            <span class="font-bold text-base mb-1">{{ auction.productName }}</span>
                            <!-- <div class="flex items-center gap-2">
                            <Icon :icon="icons[auction.productStatus]" />
                            <span :style="{ color: getColor(auction.productStatus) }">{{
                                ProductStatusNames[auction.productStatus]
                            }}</span>
                        </div> -->
                        </div>
                        <div class="flex w-full items-center justify-between">
                            <div>
                                <span class="mt-1 text-sm text-[#505050]">Price: </span>
                                <span class="text-[#505050]">${{ auction.currentPrice }}</span>
                            </div>
                            <!-- <div>
                            <span class="text-[#505050]">Bid count: </span>
                            <span class="text-[#505050]">{{ auction.bidCount }}</span>
                        </div> -->
                        </div>
                        <div>
                            <span class="text-[#505050]">Return window closed on: </span>
                            <span class="text-[#505050]">{{ auction.endTime.split('T')[0] }}</span>
                        </div>
                        <!-- <span class="text-[#505050]">Delivered on Tue 20 Dec</span> -->
                        <div>
                            <span class="text-[#505050]">Condition: </span>
                            <span class="text-[#505050]">{{ ConditionNames[auction.condition] }}</span>
                        </div>
                        <div>
                            <span class="text-sm text-[#707070]">{{ isInWatchlist ? 'Seller' : 'Sold by' }}: </span>
                            <span class="underline text-[#409EFF]">{{ auction.user.fullName }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 items-end">
                        <div>
                            <div class="flex items-center gap-2">
                                <Icon :icon="icons[auction.productStatus]" />
                                <span :style="{ color: getColor(auction.productStatus) }">{{
                                    ProductStatusNames[auction.productStatus]
                                }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="inline-block text-sm text-[#505050]">Bid count: </span>
                                <span class="inline-block text-sm text-[#505050]">{{ auction.bidCount }}</span>
                            </div>
                        </div>

                        <div class="flex flex-col mt-14 gap-2">
                            <button
                                v-show="isInWatchlist"
                                class="bg-[#409EFF] text-white border rounded-xl py-[7px] w-[200px] hover:bg-[#3A8EE4] transition"
                            >
                                Place Bid Now
                            </button>
                            <button
                                class="bg-white border rounded-xl py-[7px] w-[200px] hover:bg-[#409EFF] hover:text-white transition"
                                @click="viewDetailAuction(auction.id)"
                            >
                                View Detail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
    auction: Object,
    isInWatchlist: {
        type: Boolean,
        default: false,
    },
})

const router = useRouter()

const url = 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
    'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
    'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

const ProductStatusNames = {
    1: 'Available',
    2: 'Sold',
    3: 'Deleted',
    4: 'Canceled',
    5: 'Pending Publish',
}

const viewDetailAuction = (auctionId) => {
    router.push({ path: `auctions/${auctionId}` })
}

const icons = {
    1: 'fluent:presence-available-12-filled',
    2: 'ep:sold-out',
    3: 'material-symbols:delete',
    4: 'fluent:presence-dnd-12-filled',
    5: 'material-symbols:pending-actions',
}

const ConditionNames = {
    1: 'New',
    2: 'Open Box',
    3: 'Used',
}

const getColor = (status) => {
    switch (status) {
        case 1:
            return '#00CC33'
        case 2:
            return '#0099FF'
        case 3:
            return '#A52A2A'
        case 4:
            return '#EE7600'
        case 5:
            return '#FFA500'
    }
}
</script>

<style></style>
