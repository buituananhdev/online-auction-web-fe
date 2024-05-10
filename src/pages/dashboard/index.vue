<template>
    <div class="dashboard-container m-0">
        <div class="block text-center w-[1120px] rounded-lg">
            <span class="demonstration"></span>
            <el-carousel height="300px" class="rounded-2xl">
                <el-carousel-item v-for="item in listImg" :key="item">
                    <img class="small object-fill w-full justify-center h-full" :src="item.img" alt="image" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <div v-if="recentlyViewdList.length" class="mt-10 mx-6">
            <span class="font-bold text-2xl">Recently viewed</span>
            <div class="dashboard-list">
                <Icon v-show="recentlyViewdList.length > 3" @click="scrollToLeft(scrollBox2)" class="dashboard-arrow-icon dashboard-left-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-left" />
                <div ref="scrollBox2" class="scrollbar-flex-content scroll-custom">
                    <p v-for="item in recentlyViewdList" :key="item" class="scrollbar-demo-item">
                        <product-card :auction="item" />
                    </p>
                </div>
                <Icon v-show="recentlyViewdList.length > 3" @click="scrollRight(scrollBox2)" class="dashboard-arrow-icon dashboard-right-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-right" />
            </div>
        </div>
        <div v-if="categoriesList.length" class="dashboard-categories mt-10 mx-4">
            <span class="font-bold text-2xl">Trending on myWeb</span>
            <div class="dashboard-list">
                <Icon v-if="categoriesList.length > 6" @click="scrollToLeft(scrollBox1)" class="dashboard-arrow-icon dashboard-left-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-left" />
                <div ref="scrollBox1" class="scrollbar-flex-content scroll-custom">
                    <p v-for="item in categoriesList" :key="item" class="scrollbar-demo-item">
                        <a :href="'/auctions?categories=' + item.id"><category-card :category="item" /></a>
                    </p>
                </div>
                <Icon v-if="categoriesList.length > 6" @click="scrollRight(scrollBox1)" class="dashboard-arrow-icon dashboard-right-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-right" />
            </div>
        </div>
        <div v-if="topAuctionsList.length" class="mt-10 mx-4">
            <span class="font-bold text-2xl">Top Bid Auctions</span>
            <div class="dashboard-list">
                <Icon v-show="topAuctionsList.length > 3" @click="scrollToLeft(scrollBox)" class="dashboard-arrow-icon dashboard-left-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-left" />
                <div ref="scrollBox" class="scrollbar-flex-content scroll-custom">
                    <p v-for="item in topAuctionsList" :key="item" class="scrollbar-demo-item">
                        <product-card :auction="item" />
                    </p>
                </div>
                <Icon v-show="topAuctionsList.length > 3" @click="scrollRight(scrollBox)" class="dashboard-arrow-icon dashboard-right-icon w-[300px]"
                    icon="ic:round-keyboard-arrow-right" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { getTopAuctionsList, getRecentlyViewedList, getListAuctions } from '../../services/auction.service';
import { onMounted, ref } from 'vue'
import { useCategoryStore } from '../../stores/category.store'

const useCategory = useCategoryStore()
const listImg = [
    {
        id: 1,
        img: 'https://www.apple.com/vn/iphone-15-pro/images/overview/welcome/hero_endframe__ov6ewwmbhiqq_large.jpg',
    },
    {
        id: 2,
        img: 'https://brandsego.com/cdn/shop/collections/Screenshot_42_1600x.png?v=1696060836',
    },
    {
        id: 3,
        img: 'https://www.craftshades.com/wp-content/uploads/2023/02/Banner-2-3-compressed-1-compressed.jpg',
    },
    {
        id: 4,
        img: 'https://www.pngitem.com/pimgs/m/175-1758168_ipad-pro-ipad-pro-banner-hd-png-download.png',
    },
]
const categoriesList = ref([
    // {
    //     img: 'https://www.charleskeith.vn/dw/image/v2/BCWJ_PRD/on/demandware.static/-/Sites-vn-products/default/dwbcba1aad/images/hi-res/2023-L6-CK2-50271205-J8-1.jpg?sw=756&sh=1008',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/02_PopularDestination_Sneakers.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/03_PopularDestination_Tire.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/03_PopularDestination_Tire.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/07_PopularDestination_Toys.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/07_PopularDestination_Toys.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/07_PopularDestination_Toys.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/07_PopularDestination_Toys.jpg',
    //     name: "hhehhe"
    // },
    // {
    //     img: 'https://ir.ebaystatic.com/cr/v/c01/07_PopularDestination_Toys.jpg',
    //     name: "hhehhe"
    // },
])
const topAuctionsList = ref([]);
const recentlyViewdList = ref([]);

const getAuctionsList = async () => {
    try {
        const res = await getTopAuctionsList()
        topAuctionsList.value = res.data
        if (topAuctionsList.value) {
            const res = await getListAuctions()
            topAuctionsList.value = res.data.data
        }
    } catch (error) {
        console.log(error);
    }
}
const getRecentyViewdAuctionsList = async () => {
    try {
        const res = await getRecentlyViewedList()
        recentlyViewdList.value = res.data
        if (recentlyViewdList.value) {
            const res = await getListAuctions()
            recentlyViewdList.value = res.data.data
        }
    } catch (error) {
        console.log(error);
    }
}
const scrollBox = ref();
const scrollBox1 = ref();
const scrollBox2 = ref();

function scrollRight(scrollBox) {
    console.log('1');
    if (scrollBox) {
        console.log('2');
        scrollBox.scrollLeft += 400;
    }
}

function scrollToLeft(scrollBox) {
    console.log('1');
    if (scrollBox) {
        console.log('2');
        scrollBox.scrollLeft -= 400;
    }
}
onMounted(async () => {
    await getAuctionsList()
    await getRecentyViewdAuctionsList()
    categoriesList.value = useCategory.categoryList
})
</script>

<style scoped>
.demonstration {
    color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
}

.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
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
    gap: 16px;
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

.dashboard-list:hover .scroll-custom {
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

.dashboard-list {
    position: relative;
}

.dashboard-arrow-icon {
    z-index: 9;
    width: 20px;
    height: 20px;
    padding: 4px;
    border-radius: 50%;
    background-color: #dfdfdf;
    opacity: 0.8;
    cursor: pointer;
}

.dashboard-arrow-icon:hover {
    background-color: #ebe9e9;
}

.dashboard-arrow-icon:hover .scroll-custom {
    overflow-x: auto;
    margin-bottom: 0px;
}

.dashboard-right-icon {
    position: absolute;
    right: -10px;
    top: 45%;
}

.dashboard-left-icon {
    position: absolute;
    left: -10px;
    top: 45%;
}
</style>
