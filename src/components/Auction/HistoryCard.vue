<template>
    <div class="w-full h-[80%] gap-4 flex flex-col">
        <div class="h-fit font-medium bg-[#ffff] rounded-2xl border">
            <div class="flex gap-8 p-6 items-center">
                <div class="demo-image__preview">
                    <el-image
                        style="width: 200px; height: 200px; border-radius: 16px"
                        :src="auction?.mediaUrls?.[0] ? auction.mediaUrls[0]  : 'https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'"
                        :zoom-rate="1.2"
                        :max-scale="7"
                        :min-scale="0.2"
                        :preview-src-list="mediaUrls || 'https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'"
                        :initial-index="4"
                        fit="cover"
                    />
                </div>
                <div class="flex items-start justify-between w-full">
                    <div class="flex flex-col gap-2 mt-1 text-sm mr-6">
                        <div class="w-full flex items-center justify-between">
                            <span class="font-bold text-base mb-1">{{ auction?.productName }}</span>
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
                                <span class="text-[#505050]">{{ formatNumber(auction?.currentPrice) }} VNĐ</span>
                            </div>
                            <!-- <div>
                            <span class="text-[#505050]">Bid count: </span>
                            <span class="text-[#505050]">{{ auction.bidCount }}</span>
                        </div> -->
                        </div>
                        <div>
                            <span class="text-[#505050]">Return window closed on: </span>
                            <span class="text-[#505050]">{{ auction?.endTime.split('T')[0] }}</span>
                        </div>
                        <!-- <span class="text-[#505050]">Delivered on Tue 20 Dec</span> -->
                        <div>
                            <span class="text-[#505050]">Condition: </span>
                            <span class="text-[#505050]">{{ ConditionNames[auction?.condition] }}</span>
                        </div>
                        <div>
                            <span class="text-sm text-[#707070]">{{ isInWatchlist ? 'Seller' : 'Sold by' }}: </span>
                            <span class="underline text-[#409EFF]">{{ auction?.user?.fullName }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2 items-end">
                        <div>
                            <!-- <div class="flex items-center gap-2">
                                <Icon :icon="icons[auction.productStatus]" />
                                <span :style="{ color: getColor(auction.productStatus) }">{{
                                    ProductStatusNames[auction.productStatus]
                                }}</span>
                            </div> -->
                            <div class="flex items-center gap-2">
                                <span class="inline-block text-sm text-[#505050]">Bid count: </span>
                                <span class="inline-block text-sm text-[#505050]">{{ auction?.bidCount }}</span>
                            </div>
                        </div>

                        <div class="flex flex-col mt-14 gap-2">
                            <button
                                @click="handlePlaceBidAuction(auction)"
                                v-show="isInWatchlist"
                                class="bg-[#409EFF] text-white border rounded-xl py-[7px] w-[200px] hover:bg-[#3A8EE4] transition"
                            >
                                Place Bid Now
                            </button>
                            <button
                                class="bg-white border rounded-xl py-[7px] w-[200px] hover:bg-[#409EFF] hover:text-white transition"
                                @click="viewDetailAuction(auction?.id)"
                            >
                                View Detail
                            </button>
                            <button
                                v-show="role == 'Seller' && auction?.productStatus == 1"
                                class="hover:bg-[#E23F33] text-[#E23F33] border-gray-300 border rounded-xl py-[7px] w-[200px] hover:text-white transition"
                                @click="$emit('cancelAuction')"
                            >
                                Cancel
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
import { productStatus } from '../../utils/Enums/ProductStatus.js'
import { cancelAuction} from '../../services/auction.service'
import { useAuctionStore } from '../../stores/auction.store.js';
import { formatNumber } from '../../utils'


defineProps({
    auction: Object,
    isInWatchlist: {
        type: Boolean,
        default: false,
    },
})

const useAuction = useAuctionStore()
const router = useRouter()
const role = localStorage.getItem('role')

const ProductStatusNames = productStatus

const viewDetailAuction = (auctionId) => {
    router.push({ path: `auctions/${auctionId}` })
}

const handleCancelAuction = async(auction) => {
    try {
        await cancelAuction(auction.id)
        ElNotification({
            title: 'Cancel Auction',
            message: 'Cancel Auction Successfully!',
            type: 'success',
        })
        auction.productStatus  = 3
    } catch (error) {
        ElNotification({
            title: 'Cancel Auction',
            message: 'Cancel Auction Failed!',
            type: 'error',
        })
    }
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
            return '#FFA500'
        default:
            return '#FFA500'
    }
}
const handlePlaceBidAuction = (item) => {
    useAuction.setBidStatus(true)
    router.push(`auctions/${item.id}`)
}
</script>
