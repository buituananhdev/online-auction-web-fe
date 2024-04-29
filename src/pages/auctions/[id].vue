<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, defineProps, onMounted } from 'vue'
import { getListAuctions, getSingleAuction } from '../../services/auction.service'
import { bidAuction } from '../../services/bid.service'
import CallHub from '../../services/hub.service'
import { useAuctionStore } from '../../stores/auction.store'

const auctionId = ref()
const useAuction = useAuctionStore()
const auction = ref({})
const exploredAuctionList = ref([])
const router = useRouter()
const route = useRoute()
const imageList = [
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfdqorxj85',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskb1t44',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgikpp2d9',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfjkg93j3f',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskbfn58',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfdqorxj85',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskb1t44',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgikpp2d9',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfjkg93j3f',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskbfn58',
]
const scrollBox = ref()
const scrollBox2 = ref()
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const imagesList = [
    'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/341674110_216343407690499_4490802910609794754_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH9vYPtrrdZ-PhaBloln5Y5yF8_iM9aDlLIXz-Iz1oOUqpgulUqWSgA0TGSjuDtvFE8ttbQ4lHfpUnRn71e5Z39&_nc_ohc=NfMFrd7laMQAb7dbmJx&_nc_ht=scontent.fdad3-4.fna&oh=00_AfDOsP-nJruiTzsdmF6nIWr_mOQanORy1wn1W4d_adAtCg&oe=66277DF6',
    'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/340927170_913663319882108_7365446472345452433_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFPJzzIuBQY2gBr_ZnoGa3_ay0HKjQ9rexrLQcqND2t7J6oT_fy1QFxAoxr3CihavuNeYfKb8gq8L8Pw6LpEVcr&_nc_ohc=qalkUL7vhvUAb6X30Aq&_nc_ht=scontent.fdad3-1.fna&oh=00_AfDm4j1i_MtPWf-_OXX1XGQlkF0V4jbP1uhSen7BF9Dzag&oe=66279E77',
    'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/340874930_3549881278566824_2254323086146147866_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFVtaQikjX9aJL3NXfJ46vneRxc8mUnGY15HFzyZScZjcq5qIiMaWLdQY7-AxpNK7_4o-IPN6wF_vrHYQxf7GL3&_nc_ohc=rDFJQJX2gbcAb6OMZh2&_nc_ht=scontent.fdad3-1.fna&oh=00_AfBnyW05dQ3TzPE0F4qWsQ1XpibS3ltEkkGsapH7uQFftg&oe=66277A5C',
    'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/340485851_961472368192020_3917253428352392180_n.jpg?stp=cp6_dst-jpg&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeEeR2sq1N1LqX1DL70CZLruFBB41F-48ekUEHjUX7jx6VP4GG83TFI4ECN7UdbiRtvpblVnOCX17zTK8mejOHrJ&_nc_ohc=GG0CtmTaQEQAb5tLTmM&_nc_oc=Adjm9f39DbNVW8-mVdf8j-mSDLyEYPnUMFVExCyXKzq42sJ13cWs7EQdSgU-NOtowbs&_nc_ht=scontent.fdad3-4.fna&oh=00_AfAx3W7pY9LfTN8MD0wu5PPC3loGNMM617sXoBmqIN1teA&oe=662787F6',
]
const imageActiveIndex = ref(0)
const imageOverIndex = ref(0)
const dialogFormVisible = ref(false)
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
const bidAmount = ref()
const countdown = ref()
const bidPopUpTitle = ref('Place your bid')
const isReviewBid = ref(false)

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

function reviewBid() {
    if(!bidAmount.value || bidAmount.value < auction.value.currentPrice) return
    isReviewBid.value = true
    bidPopUpTitle.value = 'Review your bid'
}

async function getDetailAuction() {
    try {
        // const id = route.params.id
        const res = await getSingleAuction(auctionId.value)
        auction.value = res.data
    } catch (error) {
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
        const res = await bidAuction({
            auctionId: auction.value.id,
            bidAmount: bidAmount.value,
        })
        dialogFormVisible.value = false
        isReviewBid.value = false
        ElNotification({
            title: 'Bid auction',
            message: 'Bid successfully!',
            type: 'success',
        })
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

function scrollToDown(scrollBox) {
    if (scrollBox) {
        scrollBox.scrollTop += 400
    }
}

function scrollRight(scrollBox) {
    console.log('1')
    if (scrollBox) {
        console.log('2')
        scrollBox.scrollLeft += 400 // Kéo sang phải 400px
    }
}

function scrollToLeft(scrollBox) {
    console.log('1')
    if (scrollBox) {
        console.log('2')
        scrollBox.scrollLeft -= 400 // Kéo sang phải 400px
    }
}

function backtoHome() {
    router.push('/')
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

onMounted(async () => {
    useAuction.setCurrentAuctionId(route.params.id)
    await useAuction.getDetailAuction()
    auction.value = useAuction.detailAuction
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
        <el-dialog
            v-model="dialogFormVisible"
            :title="bidPopUpTitle"
            width="500"
            style="border-radius: 20px; padding: 24px; font-weight: 600"
            class="rounded-xl"
        >
            <div v-if="!isReviewBid" class="flex flex-col gap-2">
                <p class="inline-block font-bold text-xl">${{ auction.currentPrice }}</p>
                <div class="flex items-center justify-between">
                    <span class="inline-block">{{ auction.bidCount }} {{ auction.bidCount < 2 ? 'bid' : 'bids' }}</span>
                    <span class="inline-block text-sx">Time left: {{ countdown }}</span>
                </div>
                <div class="flex items-center justify-between gap-3">
                    <button
                        @click="addBidMount(auction.currentPrice + 5)"
                        class="border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]"
                    >
                        Bid {{ auction.currentPrice + 5 }}$
                    </button>
                    <button
                        @click="addBidMount(auction.currentPrice + 10)"
                        class="border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]"
                    >
                        Bid {{ auction.currentPrice + 10 }}$
                    </button>
                    <button
                        @click="addBidMount(auction.currentPrice + 15)"
                        class="border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]"
                    >
                        Bid {{ auction.currentPrice + 15 }}$
                    </button>
                </div>
                <div class="relative py-2">
                    <hr />
                    <span class="absolute left-[49%] bg-white top-[-4px] text-sm px-1">or</span>
                </div>
                <div>
                    <p>Your max bid</p>
                    <div class="flex items-center justify-between gap-3 relative">
                        <input v-model="bidAmount" type="number" class="w-2/3 border py-1 pl-8 rounded-xl" />
                        <span class="font-bold absolute left-[15px]">$</span>
                        <button
                            @click="reviewBid"
                            class="flex-1 border p-2 rounded-3xl flex-1 bg-[#409EFF] text-white hover:bg-[#3A8EE4]"
                        >
                            Review bid
                        </button>
                    </div>
                    <p :class="{ 'text-[red]': bidAmount < auction.currentPrice } || !bidAmount">
                        Enter more ${{ auction.currentPrice }}
                    </p>
                </div>
            </div>
            <div v-else class="flex flex-col gap-2">
                <div class="flex items-center">
                    <p class="w-1/3 text-base">Current bid</p>
                    <p class="text-base">
                        ${{ auction.currentPrice }} - {{ auction.bidCount }} {{ auction.bidCount < 2 ? 'bid' : 'bids' }}
                    </p>
                </div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base">Your max bid</p>
                    <p class="text-base">${{ bidAmount }}</p>
                </div>
                <div class="flex items-center">
                    <p class="w-1/3 text-base">Time left:</p>
                    <p class="text-base">{{ countdown }}</p>
                </div>
                <div class="flex items-start">
                    <p class="w-1/3 text-base">Estemated Total:</p>
                    <ul class="w-2/3">
                        <li class="text-base">${{ bidAmount + 5 }}</li>
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
                        <el-button @click="isReviewBid = false">Edit Bid</el-button>
                        <el-button type="primary" @click="handleBidAuction"> Confirm bid </el-button>
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
                    <img :src="imageList[imageOverIndex]" alt="" class="w-[500px] h-[500px] rounded-xl" />
                </div>
                <div class="auction-detail-list w-full h-fit">
                    <Icon
                        @click="scrollToLeft(scrollBox)"
                        class="auction-detail-arrow-icon auction-detail-left-icon w-[300px]"
                        icon="ic:round-keyboard-arrow-left"
                    />
                    <div ref="scrollBox" class="flex scroll-column-custom h-[100px] w-[500px] overflow-auto">
                        <p
                            v-for="(item, index) in imageList"
                            :key="index"
                            class="scrollbar-demo-item image-box"
                            @mouseleave="imageOverIndex = imageActiveIndex"
                            @mouseover="imageOverIndex = index"
                            @click="imageActiveIndex = index"
                        >
                            <img
                                :src="item"
                                alt=""
                                width="80"
                                height="80"
                                :class="{ 'image-active': imageActiveIndex === index, 'image-item rounded-lg': true }"
                            />
                        </p>
                    </div>
                    <Icon
                        @click="scrollRight(scrollBox)"
                        class="auction-detail-arrow-icon auction-detail-right-icon w-[300px]"
                        icon="ic:round-keyboard-arrow-right"
                    />
                </div>
            </div>
            <div v-show="auction.user" class="auction-detail-information flex flex-col gap-2 items-start w-[43%] py-4">
                <span class="text-xl font-semibold">{{ auction.productName }}</span>
                <div class="flex items-center gap-2 p-2 border rounded-lg w-full">
                    <img
                        class="w-[35px] h-[35px] object-contain rounded-full"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8xme21WZD0--nyHf-4B90Lmycw0tCNGjld7D1l4edsQ&s"
                        alt=""
                    />
                    <div class="flex flex-col">
                        <span>{{ auction.user && auction.user.fullName }}</span>
                        <el-rate
                            disabled
                            style="height: 15px"
                            :colors="colors"
                            score-template="({auction.user && auction.user.ratings.totalRatings})"
                        />
                    </div>
                </div>
                <div class="bg-[#FFF0DF] w-full p-3 flex items-center gap-3">
                    <p class="font-semibold w-[50px] border-r border-black">${{ auction.currentPrice }}</p>
                    <div class="flex items-center gap-2">
                        <p class="text-xs">Buy it now with:</p>
                        <p class="font-semibold">${{ auction.maxPrice }}</p>
                    </div>
                </div>
                <div class="flex gap-2 items-center">
                    <span class="font-xs text-xs border-b border-black">{{ auction.bidCount }} bids</span>
                    <span class="text-xs">Ends in: {{ countdown }}</span>
                </div>
                <div class="flex items-flex w-full">
                    <span class="inline-block text-[#8B96A5] w-1/3">Condition:</span>
                    <span class="text-[#505050]">{{ converConditionText(auction.condition) }}</span>
                </div>
                <button
                    @click="dialogFormVisible = true"
                    class="w-full bg-[#409EFF] text-white font-bold rounded-3xl py-2 text-lg hover:bg-[#3A8EE4]"
                >
                    Place bid
                </button>
                <div class="flex items-center w-full gap-4">
                    <button
                        class="w-full text-[#409EFF] rounded-3xl py-2 border-[#409EFF] border hover:bg-[#409EFF] hover:text-white"
                    >
                        Buy it now
                    </button>
                    <button
                        class="w-full text-[#409EFF] rounded-3xl py-2 border-[#409EFF] border hover:bg-[#409EFF] hover:text-white"
                    >
                        Add to Watchlist
                    </button>
                </div>
                <div v-show="auction.canReturn" class="bg-[#F7F7F7] rounded-lg w-full p-2 flex items-center gap-2">
                    <img
                        class="p-2 rounded-full bg-white"
                        src="../../assets/icons/return-icon.svg"
                        width="32"
                        height="32"
                        alt=""
                    />
                    <b>Breathe east.</b>
                    <span>Returns accepted.</span>
                </div>
                <span>
                    Returns:
                    {{ auction.canReturn ? 'Buyer pay for return shipping.' : 'Seller does not accept returns.' }}
                </span>
                <div class="flex items-center gap-2">
                    <span>Payment:</span>
                    <img
                        class="border px-2 rounded-lg"
                        src="../../assets/images/vnpay-logo.jpg"
                        width="70"
                        height="40"
                        alt=""
                    />
                </div>
            </div>
        </div>
        <div class="mt-10 mx-4">
            <span class="font-bold text-2xl">Explore related Items</span>
            <div class="auction-detail-explored-list">
                <Icon
                    @click="scrollToLeft(scrollBox2)"
                    class="auction-detail-arrow-icon auction-detail-left-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-left"
                />
                <div ref="scrollBox2" class="scrollbar-flex-content scroll-custom">
                    <p v-for="item in exploredAuctionList" :key="item" class="scrollbar-demo-item">
                        <product-card :auction="item" />
                    </p>
                </div>
                <Icon
                    @click="scrollRight(scrollBox2)"
                    class="auction-detail-arrow-icon auction-detail-right-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-right"
                />
            </div>
        </div>
        <el-tabs type="border-card" class="auction-detail-description">
            <el-tab-pane label="About this item" class="flex flex-col">
                <span class="text-xs py-2">Seller assumes all responsibility for this listing.</span>
                <span class="text-xs py-2"
                    >Last updated on {{ convertISOToRegularTime(auction.lastModifiedDate) }}</span
                >
                <span class="my-3 text-xl font-semibold">Item specifics</span>
                <div class="w-full py-2">
                    <span class="inline-block w-1/4 text-xs">Condition:</span>
                    <span class="text-xs font-semibold">{{ auction.condition }}</span>
                </div>
                <div>
                    <span class="inline-block w-1/4 text-xs">Warranty:</span>
                    <span class="text-xs font-semibold">12 Months Seller Warranty</span>
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
                        <img
                            class="border px-2 rounded-lg mt-2"
                            src="../../assets/images/vnpay-logo.jpg"
                            width="70"
                            height="40"
                            alt=""
                        />
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.auction-detail-container {
}

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
