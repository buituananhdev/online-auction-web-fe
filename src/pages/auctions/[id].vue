<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { ref, defineProps, onMounted } from 'vue';
import { getListAuctions, getSingleAuction } from '../../services/auction.service';

const auction = ref({})
const exploredAuctionList = ref([])
const router = useRouter()
const route = useRoute()
const imageList = [
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfdqorxj85',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskb1t44',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgikpp2d9',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfjkg93j3f',
    'https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskbfn58'
]
const scrollBox = ref();
const scrollBox2 = ref();
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])

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

async function getDetailAuction() {
    try {
        const id = route.params.id;
        const res = await getSingleAuction(id)
        auction.value = res.data
    } catch (error) {
        console.log(error);
    }
}

async function getExploreAuctionList() {
    try {
        if(auction.value.category) {
            const res = await getListAuctions(1, 15, '', [auction.value.category.id])
            exploredAuctionList.value = res.data.data
        } else {
            const res = await getListAuctions(1, 15)
            exploredAuctionList.value = res.data.data
        }
    } catch (error) {
        console.log(error);
    }
}

function scrollToDown(scrollBox) {
    if (scrollBox) {
        scrollBox.scrollTop += 400;
    }
}

function scrollToTop(scrollBox) {
    if (scrollBox) {
        scrollBox.scrollTop -= 400;
    }
}

function scrollRight(scrollBox) {
    console.log('1');
    if (scrollBox) {
        console.log('2');
        scrollBox.scrollLeft += 400; // Kéo sang phải 400px
    }
}

function scrollToLeft(scrollBox) {
    console.log('1');
    if (scrollBox) {
        console.log('2');
        scrollBox.scrollLeft -= 400; // Kéo sang phải 400px
    }
}

function backtoHome() {
    router.push('/')
}

onMounted(async () => {
    await getDetailAuction()
    await getExploreAuctionList()
})
</script>

<template>
    <div class="auction-detail-container">
        <el-page-header style="color:#a2a2a2 ;" title="Back to home page" :icon="ArrowLeft" @back="backtoHome">
            <template #extra>
                <span class="text-xs text-[#a2a2a2] underline">Add to Watchlist</span>
            </template>
        </el-page-header>
        <div class="flex items-start gap-8">
            <div class="auction-detail-images">
                <!-- <div class="dashboard-list">
                    <Icon @click="scrollToDown(scrollBox)" class="dashboard-arrow-icon dashboard-left-icon w-[300px]"
                        icon="ic:round-keyboard-arrow-left" />
                    <div ref="scrollBox" class="flex flex-col scroll-custom h-[200px] w-[100px] overflow-auto">
                        <p v-for="(item, index) in imageList" :key="index" class="scrollbar-demo-item">
                            <img :src="item" alt="" width="80" height="80">
                        </p>
                    </div>
                    <Icon @click="scrollToTop(scrollBox)" class="dashboard-arrow-icon dashboard-right-icon w-[300px]"
                        icon="ic:round-keyboard-arrow-right" />
                </div> -->
                <img src="https://down-vn.img.susercontent.com/file/vn-11134201-7r98o-lu63bfgskbfn58" alt=""
                    class="w-[680px] h-[550px]">
            </div>
            <div class="auction-detail-information flex flex-col gap-2 items-start w-[35%]">
                <span class="text-xl font-bold">{{ auction.productName }}</span>
                <div class="flex items-center gap-2 p-2 border rounded-lg w-full">
                    <img class="w-[35px] h-[35px] object-contain rounded-full"
                        src="https://scontent.fdad3-6.fna.fbcdn.net/v/t39.30808-1/426587256_1430509044210042_7946706195478323343_n.jpg?stp=dst-jpg_p480x480&_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=IuXde7DL6hcAb45ULXs&_nc_ht=scontent.fdad3-6.fna&oh=00_AfAdkZNPXKCrv9XYe_o6I3weKudCAs5oJ9ho_4j12SAo2Q&oe=6625998E"
                        alt="">
                    <div class="flex flex-col">
                        <span>{{ auction.user && auction.user.fullName }}</span>
                        <el-rate v-model="auction.user.ratings.avarageRating" disabled style="height: 15px;"
                            :colors="colors" score-template="({auction.user && auction.user.ratings.totalRatings})" />
                    </div>
                </div>
                <span class="text-2xl font-bold">{{ auction.currentPrice }} VNĐ</span>
                <div class="flex gap-2">
                    <span class="font-xs border-b border-black">{{ auction.bidCount }} bids</span>
                    <span>Ends in: {{ convertISOToRegularTime(auction.endTime) }}</span>
                </div>
                <span>Condition: {{ converConditionText(auction.condition) }}</span>
                <span class="text-[12px] text-[#c7c7c7]">Buy it now with</span>
                <span class="text-2xl font-bold">{{ auction.maxPrice }}</span>
                <button class="w-full bg-[#EC4D37] rounded-3xl py-2 text-lg hover:bg-[#d6331d]">Place bid</button>
                <button
                    class="w-full text-[#EC4D37] rounded-3xl py-2 text-lg border-[#EC4D37] border hover:bg-[#f2f1f1]">Buy it
                    now</button>
                <button
                    class="w-full text-[#EC4D37] rounded-3xl py-2 text-lg border-[#EC4D37] border hover:bg-[#f2f1f1]">Add to
                    Watchlist</button>
                <div v-show="auction.canReturn" class="bg-[#F7F7F7] rounded-lg w-full p-2 flex items-center gap-2">
                    <img class="p-2 rounded-full bg-white" src="../../assets/icons/return-icon.svg" width="32" height="32"
                        alt="">
                    <b>Breathe east.</b>
                    <span>Returns accepted.</span>
                </div>
                <span>
                    Returns: {{ auction.canReturn ? 'Buyer pay for return shipping.' : 'Seller does not accept returns.' }}
                </span>
                <div class="flex items-center gap-2">
                    <span>Payment:</span>
                    <img class="border px-2 rounded-lg" src="../../assets/images/vnpay-logo.jpg" width="70" height="40"
                        alt="">
                </div>
            </div>
        </div>
        <div class="mt-10 mx-4">
            <span class="font-bold text-2xl">Explore related Items</span>
            <div class="detail-auction-explored-list">
                <Icon @click="scrollToLeft(scrollBox2)" class="detail-auction-arrow-icon detail-auction-left-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-left" />
                <div ref="scrollBox2" class="scrollbar-flex-content scroll-custom">
                    <p v-for="item in exploredAuctionList" :key="item" class="scrollbar-demo-item">
                        <product-card :auction="item" />
                    </p>
                </div>
                <Icon @click="scrollRight(scrollBox2)" class="detail-auction-arrow-icon detail-auction-right-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-right" />
            </div>
        </div>
        <div>
        </div>
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

.detail-auction-explored-list:hover .scroll-custom {
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

.detail-auction-explored-list {
    position: relative;
}

.detail-auction-arrow-icon {
    z-index: 9;
    width: 20px;
    height: 20px;
    padding: 4px;
    border-radius: 50%;
    background-color: #dfdfdf;
    opacity: 0.8;
    cursor: pointer;
}

.detail-auction-arrow-icon:hover {
    background-color: #ebe9e9;
}

.detail-auction-arrow-icon:hover .scroll-custom {
    overflow-x: auto;
    margin-bottom: 0px;
}

.detail-auction-right-icon {
    position: absolute;
    right: -10px;
    top: 45%;
}

.detail-auction-left-icon {
    position: absolute;
    left: -10px;
    top: 45%;
}
</style>