<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, defineProps, computed, onBeforeMount, onMounted, watch, watchEffect } from 'vue'
import { getListAuctions, getSingleAuction, updatePredictPrice } from '../../services/auction.service'
import { addWatchlist, deleteWatchlist } from '../../services/watchlist.service'
import { bidAuction } from '../../services/bid.service'
import { useAuctionStore } from '../../stores/auction.store'
import { authStore } from '../../stores/auth.store'
import { formatNumber } from '../../utils/index.js'
import PredictPrice from '../../services/gemini-ai.service.js'

const auth = authStore()
const auctionId = ref()
const hover = ref(false)
const useAuction = useAuctionStore()
const auction = computed(() => useAuction.watchingAuction);
const exploredAuctionList = ref([])
const router = useRouter()
const route = useRoute()
const listImage = ref([])
const userRole = ref(localStorage.getItem('role'))

const rating = ref({
    totalRatings: 0,
    averageRating: 0,
})

const id = computed(() => {
    console.log(route.params.id);
    return route.params.id
})

const predictAvgPrice = ref(0);
const scrollBox = ref()
const scrollBox2 = ref()
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

const currentAuction = ref({
    auctionId: null,
    type: 2,
})

const imageActiveIndex = ref(0)
const imageOverIndex = ref(0)
const dialogFormVisible = ref(useAuction.isBidding)

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

const isBuyAvailable = ref(false)
const bidAmount = ref()
const countdown = ref()
const bidPopUpTitle = ref('Place your bid')
const isReviewBid = ref(false)

const handlePlaceBid = (data = false) => {
    if (!auth.isLoggedIn) {
        return router.push('/login')
    }
    if (data === true) {
        isBuyAvailable.value = true
        bidPopUpTitle.value = 'Review your order'
        bidAmount.value = auction.value.maxPrice
        isReviewBid.value = true
    } else {
        isReviewBid.value = false
        isBuyAvailable.value = false
    }
    dialogFormVisible.value = true
}

const handleEditBid = () => {
    if (isBuyAvailable.value) {
        isBuyAvailable.value = false
        dialogFormVisible.value = false
    } else {
        isReviewBid.value = false
    }
}

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

const handleSetWatchlist = () => {
    if (auction.value.isWatched) {
        removeWatchlist()
    } else {
        addToWatchlist()
    }
}

function reviewBid() {
    if (!bidAmount.value || bidAmount.value < auction.value.currentPrice) return
    isReviewBid.value = true
    bidPopUpTitle.value = 'Review your bid'
}

const addToWatchlist = async () => {
    try {
        await addWatchlist(currentAuction.value)
        auction.value.isWatched = !auction.value.isWatched
        ElNotification({
            title: 'Add To Watchlist',
            message: 'Add To Watchlist Successfully!',
            type: 'success',
        })
    } catch (error) {
        ElNotification({
            title: 'Add To Watchlist',
            message: 'Add To Watchlist Failed!',
            type: 'error',
        })
        console.log(error)
    }
}

const removeWatchlist = async () => {
    try {
        await deleteWatchlist(currentAuction.value.auctionId)
        auction.value.isWatched = !auction.value.isWatched
        ElNotification({
            title: 'Unwatch',
            message: 'Unwatch Successfully!',
            type: 'success',
        })
    } catch (error) {
        ElNotification({
            title: 'Unwatch',
            message: 'Unwatch Failed!',
            type: 'error',
        })
        console.log(error)
    }
}

async function getExploreAuctionList() {
    try {
        if (auction.value.category) {
            const res = await getListAuctions(1, 15, '', [auction.value.category.id])
            exploredAuctionList.value = res.data.data
        } else {
            const res = await getListAuctions(1, 15)
            exploredAuctionList.value = res.data.data
        }
    } catch (error) {
        console.log(error)
    }
}

async function handleBidAuction() {
    try {
        dialogFormVisible.value = false
        isReviewBid.value = false
        if (isBuyAvailable.value) {
            useAuction.setPurchasePrice(bidAmount.value)
            router.push(`/payments/${auction.value.id}`)
            isBuyAvailable.value = false
        } else {
            const res = await bidAuction({
                auctionId: auction.value.id,
                bidAmount: bidAmount.value,
            })
        }
        bidAmount.value = null
    } catch (error) {
        console.log(error)
        ElNotification({
            title: 'Bid auction',
            message: 'Bid failed!',
            type: 'error',
        })
    }
}

function addBidMount(mount) {
    bidAmount.value = mount
}

function scrollRight(scrollBox) {
    if (scrollBox) {
        scrollBox.scrollLeft += 400 // Kéo sang phải 400px
    }
}

function scrollToLeft(scrollBox) {
    if (scrollBox) {
        scrollBox.scrollLeft -= 400 // Kéo sang phải 400px
    }
}

function backtoHome() {
    router.push('/')
}

function goToSellerInfor(id) {
    router.push(`/seller/${id}`)
}

function startCountdown(dateTime) {
    const targetDate = new Date(dateTime)
    setInterval(() => {
        const currentDate = new Date()
        const timeDiff = targetDate - currentDate
        if (timeDiff <= 0) {
            countdown.value = 'expired'
            return
        }
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

        countdown.value = `${days}d, ${hours}h, ${minutes}m, ${seconds}s  `
    }, 1000)
}

watch(id, async () => {
    await useAuction.syncAuction(id.value)
    listImage.value = auction.value.mediaUrls;
    rating.value = auction.value.user.ratings.avarageRating
    window.scrollTo(0, 0)
})

onBeforeMount(async () => {
    await useAuction.syncAuction(id.value)
    currentAuction.value.auctionId = auction.value.id
    console.log(auction.value.mediaUrls);
    listImage.value = auction.value.mediaUrls;
    rating.value = auction.value.user.ratings.avarageRating
    console.log(auction.value.predictAvgPrice);
    if (auction.value.predictAvgPrice == 0) {
        const res = await PredictPrice(auction.value)
        if (parseFloat(res)) {
            predictAvgPrice.value = res;
            await updatePredictPrice(id.value, res);
        } else {
            predictAvgPrice.value = "AI can't predict the price of this product, please reload the page to try again."
        }
    } else {
        predictAvgPrice.value = auction.value.predictAvgPrice
    }
    await getExploreAuctionList()
    startCountdown(auction.value.endTime)
})
</script>

<template>
    <div class="auction-detail-container">
        <el-page-header style="color: #a2a2a2" title="Back to home page" :icon="ArrowLeft" @back="backtoHome">
            <template #extra>
                <span class="text-xs text-[#a2a2a2] underline">Add to Watchlist</span>
            </template>
        </el-page-header>
        <el-dialog v-model="dialogFormVisible" :title="bidPopUpTitle" width="500"
            style="border-radius: 20px; padding: 24px; font-weight: 600" class="rounded-xl">
            <div v-if="!isReviewBid" class="flex flex-col gap-2">
                <p class="inline-block font-bold text-xl">{{ formatNumber(auction.currentPrice) }} VNĐ</p>
                <div class="flex items-center justify-between">
                    <span class="inline-block">{{ auction.bidCount }} {{ auction.bidCount < 2 ? 'bid' : 'bids' }}</span>
                            <span class="inline-block text-sx">Time left: {{ countdown }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                    <button @click="addBidMount(auction.currentPrice + 50000)"
                        class="border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]">
                        Bid {{ formatNumber(auction.currentPrice + 50000) }} VNĐ
                    </button>
                    <button @click="addBidMount(auction.currentPrice + 100000)"
                        class="border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]">
                        Bid {{ formatNumber(auction.currentPrice + 100000) }} VNĐ
                    </button>
                    <button @click="addBidMount(auction.currentPrice + 150000)"
                        class="border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]">
                        Bid {{ formatNumber(auction.currentPrice + 150000) }} VNĐ
                    </button>
                </div>
                <div class="relative py-2">
                    <hr />
                    <span class="absolute left-[49%] bg-white top-[-4px] text-sm px-1">or</span>
                </div>
                <div>
                    <p>Your max bid</p>
                    <div class="flex items-center justify-between gap-3 relative">
                        <el-input v-model="bidAmount" style="width: 70%;"
                            :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')" />
                        <span class="font-bold absolute left-[15px]"></span>
                        <button @click="reviewBid"
                            class="flex-1 border p-2 rounded-3xl bg-[#409EFF] text-white hover:bg-[#3A8EE4]">
                            Review bid
                        </button>
                    </div>
                    <p :class="{ 'text-[red]': bidAmount < auction.currentPrice } || !bidAmount">
                        Enter more {{ formatNumber(auction.currentPrice) }} VNĐ
                    </p>
                </div>
            </div>
            <div v-else class="flex flex-col gap-2">
                <div class="flex items-center">
                    <p class="w-1/3 text-base">Current bid</p>
                    <p class="text-base">
                        {{ formatNumber(auction.currentPrice) }} VNĐ - {{ auction.bidCount }} {{ auction.bidCount < 2
                            ? 'bid' : 'bids' }} </p>
                </div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base">Your max bid</p>
                    <p class="text-base">{{ formatNumber(bidAmount) }} VNĐ</p>
                </div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base">Time left:</p>
                    <p class="text-base">{{ countdown }}</p>
                </div>
                <div class="flex items-start">
                    <p class="w-1/3 text-base">Estemated Total:</p>
                    <ul class="w-2/3">
                        <li class="text-base">{{ formatNumber(bidAmount + 5) }} VNĐ</li>
                        <li class="text-base text-[#9B9B9B]">
                            *This item may be subject to duties and taxes upon delivery.
                        </li>
                        <li class="text-base text-[#9B9B9B]">
                            *This item may be subject to duties and taxes upon delivery.
                        </li>
                    </ul>
                </div>
            </div>
            <template #footer>
                <div v-show="isReviewBid">
                    <div class="dialog-footer">
                        <el-button @click="handleEditBid">{{ isBuyAvailable ? 'Close' : 'Edit Bid' }}</el-button>
                        <el-button type="primary" @click="handleBidAuction">{{ isBuyAvailable ? 'Confirm order' :
                            'Confirm bid' }}</el-button>
                    </div>
                    <div class="text-xs text-[#5B5252] pt-6 text-left">
                        When you confirm your bid, it means you’re committing to buy this item if you’re the winning
                        bidder. It also means you've read and agreed to the eBay International Shipping Terms &
                        ConditionsOpens in new window or tab.. The duties and taxes shown may change based on your
                        winning bid.
                    </div>
                </div>
            </template>
        </el-dialog>
        <div class="flex items-start gap-10 p-8 border rounded-2xl mt-3">
            <div class="auction-detail-images flex flex-col items-start">
                <div class="border p-3 rounded-lg">
                    <img :src="listImage[imageOverIndex] || 'https://as1.ftcdn.net/v2/jpg/04/62/93/66/1000_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg'"
                        alt="" class="w-[500px] h-[500px] rounded-xl object-cover" />
                </div>
                <div v-show="listImage.length" class="auction-detail-list w-full h-fit">
                    <Icon v-show="listImage.length > 6" @click="scrollToLeft(scrollBox)"
                        class="auction-detail-arrow-icon auction-detail-left-icon w-[300px]"
                        icon="ic:round-keyboard-arrow-left" />
                    <div ref="scrollBox" class="flex scroll-column-custom h-[100px] w-[500px] overflow-auto">
                        <p v-for="(item, index) in listImage" :key="index" class="scrollbar-demo-item image-box"
                            @mouseleave="imageOverIndex = imageActiveIndex" @mouseover="imageOverIndex = index"
                            @click="imageActiveIndex = index">
                            <img :src="item" alt="" width="80" height="80" class="object-cover"
                                :class="{ 'image-active': imageActiveIndex === index, 'image-item rounded-lg': true }" />
                        </p>
                    </div>
                    <Icon v-show="listImage.length > 6" @click="scrollRight(scrollBox)"
                        class="auction-detail-arrow-icon auction-detail-right-icon w-[300px]"
                        icon="ic:round-keyboard-arrow-right" />
                </div>
            </div>
            <div v-show="auction.user" class="auction-detail-information flex flex-col gap-2 items-start w-[43%] py-4">
                <span class="text-xl font-semibold">{{ auction.productName }}</span>
                <div class="cursor-pointer flex items-center gap-2 p-2 border rounded-lg w-full"
                    @click="goToSellerInfor(auction.user.id)">
                    <img class="w-[35px] h-[35px] object-contain rounded-full"
                        :src="auction.user.avatar || 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png'"
                        alt="" />
                    <div class="flex flex-col">
                        <span>{{ auction.user && auction.user.fullName }}</span>
                        <el-rate disabled style="height: 15px" :colors="colors" v-model="rating"
                            score-template="({auction.user && auction.user.ratings.totalRatings})" />
                    </div>
                </div>
                <div class="bg-[#FFF0DF] w-full p-3 flex items-center gap-3">
                    <p class="font-semibold min-w-[50px] pr-2 border-r border-black">{{
                        formatNumber(auction.currentPrice) }}
                        VNĐ</p>
                    <div class="flex items-center gap-2">
                        <p class="text-xs">Buy it now with:</p>
                        <p class="font-semibold text-sm text-[#505050]">{{ formatNumber(auction.maxPrice) }} VNĐ</p>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <span class="text-xs text-[#409EFF] flex items-center gap-1"> <span> <img width="15px" src="../../assets/icons/google-gemini-icon.svg" alt=""> </span> Google gemini AI predict price: {{ Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(predictAvgPrice) }}</span>
                </div>
                <div class="flex gap-2 items-center">
                    <span class="font-xs text-xs border-b border-black">{{ auction.bidCount }} bids</span>
                    <span class="text-xs">Ends in: {{ auction.productStatus === 2? 'Sold' : countdown }}</span>
                </div>
                <div class="flex items-flex w-full">
                    <span class="inline-block text-[#8B96A5] w-1/3">Condition:</span>
                    <span class="text-[#505050]">{{ converConditionText(auction.condition) }}</span>
                </div>
                <button v-show="userRole === 'Buyer'" @click="handlePlaceBid"
                    class="w-full bg-[#409EFF] text-white font-bold rounded-3xl py-2 text-lg hover:bg-[#3A8EE4] transition-all">
                    Place bid
                </button>
                <div v-show="userRole === 'Buyer'" class="flex items-center w-full gap-2">
                    <button
                        class="w-full text-[#409EFF] rounded-3xl py-2 border-[#409EFF] border hover:bg-[#409EFF] hover:text-white transition-all"
                        @click="handlePlaceBid(true)">
                        Buy it now
                    </button>
                    <button
                        class="w-full text-[#409EFF] rounded-3xl py-2 border-[#409EFF] border hover:bg-[#409EFF] hover:text-white transition-all"
                        @click="handleSetWatchlist" @mouseenter="hover = true" @mouseleave="hover = false">
                        {{ auction.isWatched && hover ? 'Unwatch' : auction.isWatched ? 'Watching' : 'Add to watchlist'
                        }}
                    </button>
                </div>
                <div v-show="auction.canReturn" class="bg-[#F7F7F7] rounded-lg w-full p-2 flex items-center gap-2">
                    <img class="p-2 rounded-full bg-white" src="../../assets/icons/return-icon.svg" width="32"
                        height="32" alt="" />
                    <b>Breathe east.</b>
                    <span>Returns accepted.</span>
                </div>
                <span>
                    Returns:
                    {{ auction.canReturn ? 'Buyer pay for return shipping.' : 'Seller does not accept returns.' }}
                </span>
                <div class="flex items-center gap-2">
                    <span>Payment:</span>
                    <div class="flex items-center gap-2">
                        <img class="border px-2 rounded-lg mt-2 h-[50px]" src="../../assets/images/vnpay-logo.jpg"
                            width="70" alt="" />
                        <img class="border px-2 rounded-lg mt-2 h-[50px] py-4" src="../../assets/images/noidia.png"
                            width="70" alt="" />
                        <img class="border px-2 rounded-lg mt-2 h-[50px] py-2" src="../../assets/images/visa.png"
                            width="70" alt="" />
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-10 mx-4">
            <span class="font-bold text-2xl">Explore related Items</span>
            <div class="auction-detail-explored-list">
                <Icon v-show="exploredAuctionList.length > 3" @click="scrollToLeft(scrollBox2)"
                    class="auction-detail-arrow-icon auction-detail-left-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-left" />
                <div ref="scrollBox2" class="scrollbar-flex-content scroll-custom">
                    <p v-for="item in exploredAuctionList" :key="item" class="scrollbar-demo-item">
                        <product-card :auction="item" />
                    </p>
                </div>
                <Icon v-show="exploredAuctionList.length > 3" @click="scrollRight(scrollBox2)"
                    class="auction-detail-arrow-icon auction-detail-right-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-right" />
            </div>
        </div>
        <el-tabs type="border-card" class="auction-detail-description">
            <el-tab-pane label="About this item" class="flex flex-col">
                <span class="text-xs py-2">Seller assumes all responsibility for this listing.</span>
                <span class="text-xs py-2">Last updated on {{ convertISOToRegularTime(auction.lastModifiedDate)
                    }}</span>
                <div class="mt-4">
                    <span class="my-3 text-xl font-semibold">Item specifics</span>
                    <div class="w-full py-2">
                        <span class="inline-block w-1/4 text-xs">Condition:</span>
                        <span class="text-xs font-semibold">{{ auction.condition }}</span>
                    </div>
                    <div>
                        <span class="inline-block w-1/4 text-xs">Warranty:</span>
                        <span class="text-xs font-semibold">12 Months Seller Warranty</span>
                    </div>
                </div>
                <div class="mt-4">
                    <span class="inline-block my-3 text-xl font-semibold pb-2">Item description from the seller</span>
                    <div v-html="auction.description"></div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="Returns and payments">
                <div>
                    <p class="text-xl font-semibold py-4">Return policy</p>
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="bg-[#E8E8E8] h-[30px]">
                                <th class="text-xs font-medium text-start w-1/3 pl-2">
                                    After receiving the item, contact seller within
                                </th>
                                <th class="text-xs font-medium text-start w-1/3">Refund will be given as</th>
                                <th class="text-xs font-medium text-start w-1/3">Return shipping</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-xs font-normal text-start leading-8 w-1/3 pl-2">
                                    The Sliding Mr. Bones (Next Stop, Pottersville)
                                </td>
                                <td class="text-xs font-normal text-start leading-8 w-1/3">Malcolm Lockyer</td>
                                <td class="text-xs font-normal text-start leading-8 w-1/3">1961</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="w-full">
                    <p class="text-xl font-semibold py-4">Payment details</p>
                    <div class="w-full">
                        <p class="text-xs font-medium bg-[#E8E8E8] leading-8 pl-2 w-full">Payment</p>
                        <div class="flex items-center gap-6">
                            <img class="border px-2 rounded-lg mt-2 h-[50px]" src="../../assets/images/vnpay-logo.jpg"
                                width="70" alt="" />
                            <img class="border px-2 rounded-lg mt-2 h-[50px] py-4" src="../../assets/images/noidia.png"
                                width="70" alt="" />
                            <img class="border px-2 rounded-lg mt-2 h-[50px] py-2" src="../../assets/images/visa.png"
                                width="70" alt="" />
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.auction-detail-container {}

.scrollbar-flex-content {
    display: flex;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: 16px 18px 0px 0;
    border-radius: 4px;
    cursor: pointer;
}

.scrollbar-demo-item:hover {
    border-radius: 16px;
}

.scroll-custom {
    overflow-x: hidden;
    scroll-behavior: smooth;
    padding-bottom: 7px;
}

.scroll-custom::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #ffff;
}

.auction-detail-explored-list:hover .scroll-custom {
    overflow-x: auto;
    padding-bottom: 0px;
}

.scroll-custom::-webkit-scrollbar {
    height: 7px;
}

.scroll-custom::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #dfdfdf;
}

.auction-detail-explored-list {
    position: relative;
}

.auction-detail-arrow-icon {
    z-index: 99;
    width: 24px;
    height: 24px;
    padding: 4px;
    border-radius: 50%;
    background-color: #dfdfdf;
    opacity: 0.8;
    cursor: pointer;
}

.auction-detail-arrow-icon:hover {
    background-color: #ebe9e9;
}

.auction-detail-arrow-icon:hover .scroll-custom {
    overflow-x: auto;
    margin-bottom: 0px;
}

.auction-detail-right-icon {
    position: absolute;
    right: 0px;
    top: 45%;
}

.auction-detail-left-icon {
    position: absolute;
    left: 0px;
    top: 45%;
}

.auction-detail-list {
    position: relative;
    overflow: hidden;
}

.auction-detail-top-icon {
    position: absolute;
    /* top: -10px; */
    left: 30%;
}

.auction-detail-bottom-icon {
    position: absolute;
    bottom: 0px;
    left: 30%;
}

.scroll-column-custom {
    scroll-behavior: smooth;
}

.scroll-column-custom::-webkit-scrollbar {
    display: none;
}

.image-item:hover {
    border: 1px solid black;
}

.image-active {
    border: 1.5px solid black;
}

.auction-detail-description {
    margin-top: 20px;
}
</style>
