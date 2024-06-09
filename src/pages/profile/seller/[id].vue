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
                :src="seller.avatar || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg'"
                alt="">
            <div>
                <span class="text-[32px] font-semibold">{{ seller.fullName }}</span>
                <div class="flex items-center gap-3">
                    <span><b>{{ feedbackList.length }}</b> feedback</span>
                    <span><b>{{ productList.length }}</b> items</span>
                    <el-rate disabled show-score v-model="rating" :score-template="rating?.toFixed(2)+' points'" />
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
                <div v-if="productList.length" class="py-[30px] flex item-center flex-wrap gap-[24px] px-[60px]">
                    <product-card v-for="item in productList" :key="item.id" :auction="item" />

                </div>
                <div v-else class="w-full">
                    <el-empty description="No data" />
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
                <div v-if="feedbackList.length" class="flex flex-col py-[20px] px-[10px]">
                    <div v-for="(item, index) in feedbackList" :key="index">
                        <feedback-item :feedbackItem="item" />
                    </div>
                </div>
                <div v-else class="w-full">
                    <el-empty description="No data" />
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>