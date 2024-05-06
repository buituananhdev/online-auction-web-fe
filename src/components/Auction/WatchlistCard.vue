<template>
    <div class="w-full h-[80%] gap-4 flex flex-col">
        <!-- <div class="flex justify-between px-5 bg-[#f7f7f7] text-[#191919] font-medium">
            <div class="flex gap-4 items-center py-3">
                <Icon :icon="icons[auction.productStatus]" />
                <div class="flex flex-col">
                    <span class="font-bold">{{ ProductStatusNames[auction.productStatus] }}</span>
                    <div class="flex gap-10">
                        <span
                            >Product Name:
                            {{
                                auction.productName.length > 30
                                    ? auction.productName.slice(0, 30) + '...'
                                    : auction.productName
                            }}</span
                        >
                        <span
                            >Order total: <span class="font-bold">{{ auction.currentPrice }}$</span></span
                        >
                        <span>Condition: {{ ConditionNames[auction.condition] }}</span>
                    </div>
                </div>
            </div>
            <el-button :key="primary" style="padding: 18px 40px" class="my-auto">View order details</el-button>
        </div> -->
        <div class="bg-[#ffff] rounded-2xl border">
            <div class="flex gap-8 p-6 items-center">
                <div class="demo-image__preview">
                    <el-image
                        style="width: 160px; height: 160px; border-radius: 16px"
                        :src="auction.mediaUrls[0] || 'https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'"
                        :zoom-rate="1.2"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="auction.mediaUrls || 'https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'"
                        :initial-index="4"
                        fit="cover"
                    />
                </div>
                <div class="flex items-start justify-between w-full">
                    <div class="flex flex-col gap-2 text-sm mr-6">
                        <div class="w-full flex flex-col">
                            <span class="font-medium text-[#363636]">{{ auction.productName }}</span>
                            <div class="text-xs text-[#707070] mt-[2px] mb-2">
                                <span>Condition: </span>
                                <span>{{ ConditionNames[auction.condition] }}</span>
                            </div>
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
                        <span class="text-[#505050]">Delivered on Tue 20 Dec</span>
                        <!-- <div>
                        <span class="text-[#505050]">Bid count: </span>
                        <span class="text-[#505050]">{{ auction.bidCount }}</span>
                    </div> -->
                        <div>
                            <span class="text-sm text-[#707070]">Sold by: </span>
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

                        <button
                            class="bg-white border rounded-xl py-[7px] w-[200px] mt-14 hover:bg-[#409EFF] hover:text-white transition"
                        >
                            View Detail
                        </button>
                    </div>
                </div>

                <!-- <div class="flex justify-end flex-auto mr-5">
                    <el-button style="min-width: 196px; padding: 18px 0" class="my-auto" type="primary"
                        >More actions</el-button
                    >
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { productStatus } from '../../utils/Enums/ProductStatus.js'

defineProps({
    auction: Object,
})

// const url = 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
// const srcList = [
//     'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
//     'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
//     'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
//     'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
//     'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
//     'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
// ]

const ProductStatusNames = productStatus

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
            return '#FFA500'
        default:
            return '#FFA500'
    }
}
</script>

<style></style>
