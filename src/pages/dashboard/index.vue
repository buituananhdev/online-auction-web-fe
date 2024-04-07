<template>
    <div class="container m-0">
        <div class="block text-center w-[1120px] rounded-lg">
            <span class="demonstration"></span>
            <el-carousel height="300px" class="rounded-2xl">
                <el-carousel-item v-for="item in listImg" :key="item" class="">
                    <img class="small object-fill w-full justify-center h-full" :src="item.img" alt="image" />
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="mt-10 mx-4">
            <span class="font-bold text-2xl">Phone</span>
            <el-scrollbar>
                <div class="scrollbar-flex-content">
                    <p v-for="item in listPhones" :key="item" class="scrollbar-demo-item">
                        <product-card :auction="item" />
                    </p>
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>
<script setup>
import { getListAuctions } from '../../services/auction.service';
import { onMounted, ref } from 'vue';
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

const listPhones = ref([])
const getListPhone = async () => {
    const data = await getListAuctions(
        1,
        16,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        [1]
    )
    console.log(data);
    listPhones.value = data.data.data
}
onMounted(() => {
    getListPhone()
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
    height: 300px;
    margin: 16px 18px 16px 0;
    border-radius: 4px;
}
</style>
