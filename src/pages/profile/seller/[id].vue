<script setup>
import { getListAuctions } from '../../../services/auction.service'
import { getFeedbackSellerList } from '../../../services/feedback.service'
import { getUserInformation } from '../../../services/user.service'
import { ShoppingCart, User, Comment } from '@element-plus/icons-vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productList = ref([])
const activeName = ref('first')
const sellerId = ref(route.params.id)
const seller = ref({})
const feedbackList = ref([])
const rating = ref()

const user = {
    fullName: "User@e5fba6",
    email: "imseller@gmail.com",
    phone: "",
    address: "",
    avatar: null,
    role: 2,
    status: 1,
    ratings: {
        avarageRating: 5,
        totalRatings: 1
    }
}

async function getProductItem() {
    try {
        const res = await getListAuctions()
        productList.value = res.data.data
    } catch (error) {
        console.error(error);
    }
}

async function getSellerInformation() {
    try {
        const res = await getUserInformation(sellerId.value)
        seller.value = res.data
    } catch (error) {
        console.error(error);
    }
}

async function getFeedbackList() {
    try {
        const res = await getFeedbackSellerList(sellerId.value)
        feedbackList.value = res.data
    } catch (error) {
        console.error(error);
    }
}
onMounted(async () => {
    sellerId.value = route.params.id
    await getSellerInformation()
    await getFeedbackList()
    await getProductItem()
    rating.value = seller.value.ratings.avarageRating
})
</script>

<template>
    <div>
        <div class="flex items-center gap-4 p-[32px] rounded-[20px] bg-[#F6F6F6] mb-[40px]">
            <img class="w-[120px] h-[120px] rounded-full"
                :src="seller.avatar || 'https://scontent.fsgn2-3.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=mTwok-KpNkoQ7kNvgHHkIu4&_nc_ht=scontent.fsgn2-3.fna&oh=00_AfCt-oNHFsCC1xjcBfzkXmgyxJZInGuYuKKcA5rZwQDiCQ&oe=66400B10'"
                alt="">
            <div>
                <span class="text-[32px] font-semibold">{{ seller.fullName }}</span>
                <div class="flex items-center gap-3">
                    <span><b>{{ feedbackList.length }}</b> feedback</span>
                    <span><b>10</b> items sold</span>
                    <el-rate disabled v-model="rating" />
                </div>
            </div>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs px-[30px]">
            <el-tab-pane name="first">
                <template #label>
                    <div class="flex items-center gap-2">
                        <el-icon color="#409eff" size="20">
                            <ShoppingCart />
                        </el-icon>
                        <span class="text-[#6C6C6C] text-sm font-semibold">Shop</span>
                    </div>
                </template>
                <div class="py-[30px] flex item-center flex-wrap gap-[24px] px-[10px]">
                    <product-card v-for="item in productList" :key="item.id" :auction="item" />
                </div>
            </el-tab-pane>
            <el-tab-pane label="Feedback" name="third">
                <template #label>
                    <div class="flex items-center gap-2">
                        <el-icon color="#409eff" size="20">
                            <Comment />
                        </el-icon>
                        <span class="text-[#6C6C6C] text-sm font-semibold">Feedback</span>
                    </div>
                </template>
                <div class="flex flex-col py-[20px] px-[10px]">
                    <div v-for="(item, index) in feedbackList" :key="index">
                        <feedback-item :feedbackItem="item" />
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>