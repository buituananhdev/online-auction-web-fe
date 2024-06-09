<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuctionStore } from '../../../stores/auction.store';
import { getSingleAuction } from '../../../services/auction.service'
import { bidAuction } from '../../../services/bid.service'
import { feedBack } from '../../../services/feedback.service'

const useAuction = useAuctionStore()
const route = useRoute()
const router = useRouter()
const auctionId = ref()
const auction = ref({})
const feedback = ref({})
const isTransactionSuccess = ref(true)
const number = ref(0)
const dialogVisible = ref(false)
const transactionInf = ref({})

async function getTransactionStatus(id) {
    switch (id) {
        case '00':
            isTransactionSuccess.value = true;
            dialogVisible.value = true;
            await buyItem()
            break;
        default:
            isTransactionSuccess.value = false;
            break;
    }
}

async function getDetailAuction() {
    try {
        const res = await getSingleAuction(auctionId.value)
        auction.value = res.data
    } catch (err) {
        console.error(err)
    }
}

async function sendFeedback() {
    try {
        feedback.value.toUserId = auction.value.user.id
        feedback.value.relatedId = parseInt(auctionId.value)
        const res = await feedBack(feedback.value)
        dialogVisible.value = false
        router.push('/')
        ElNotification({
            title: 'Feedback',
            message: 'Feedback Successfully!',
            type: 'success',
        })
    } catch (error) {
        console.error(error);
        ElNotification({
            title: 'Feedback',
            message: 'Feedback Failed!',
            type: 'error',
        })
    }
}

async function buyItem() {
    try {
        const res = await bidAuction({
            auctionId: auctionId.value,
            bidAmount: auction.value.maxPrice,
        })
    } catch (error) {   
        console.error(error);
    }
}

async function addPayment() {
    try {
        const res = await postPayment({
            auctionId: auctionId.value,
            amount: auction.value.maxPrice,
        })
    } catch (error) {
        console.error(error);
    }
}

onBeforeMount(async () => {
    if (route.query.vnp_TxnRef) {
        transactionInf.value.number = route.query.vnp_TxnRef
    }
    if (route.query.vnp_Amount) {
        transactionInf.value.amount = route.query.vnp_Amount
    }
    if(route.query.vnp_TransactionNo) {
        transactionInf.value.transactionNumber = route.query.vnp_TransactionNo
    }
    if(route.query.vnp_ResponseCode) {
        transactionInf.value.code = route.query.vnp_ResponseCode
    }
    if (route.query.vnp_BankCode) {
        transactionInf.value.bank = route.query.vnp_BankCode
    }
    auctionId.value = localStorage.getItem('auctionId')
    if (useAuction.watchingAuction.id) {
        auction.value = useAuction.watchingAuction
    } else {
        await getDetailAuction()
    }
    if (route.query.vnp_TransactionStatus) {
        getTransactionStatus(route.query.vnp_TransactionStatus)
    }
    transactionInf.bidId = 1
})
</script>

<template>
    <div class="flex justify-center pt-[80px]">
        <div class="w-1/2 border shadow rounded-2xl relative z-1 bg-white">
            <el-result v-if="isTransactionSuccess" icon="success" title="Payment success">
                <template #extra>
                    <div class="flex flex-col items-center gap-5">
                        <span>Your order number is <span class="font-semibold text-[#409eff]">{{ transactionInf.number }}</span></span>
                        <div>
                            <el-button size="large" class="w-[150px]" @click="router.push('/auctions')">Continue
                                shopping</el-button>
                            <el-button size="large" class="w-[150px]" type="primary"
                                @click="dialogVisible = isTransactionSuccess">Rate</el-button>
                        </div>
                    </div>
                </template>
            </el-result>
            <el-result v-else icon="error" title="Payment Failed">
                <template #extra>
                    <div class="flex flex-col items-center gap-5">
                        <span>An error occurred during the transaction, please try again later</span>
                        <div class="flex items-center justify-center gap-2">
                            <el-button class="w-[150px]" size="large" @click="router.push('/')">Go to home
                                page</el-button>
                            <el-button class="w-[150px]" size="large" type="primary"
                                @click="router.push(`/payments/${auctionId}`)">Try again</el-button>
                        </div>
                    </div>
                </template>
            </el-result>
        </div>
        <el-dialog v-model="dialogVisible" width="540" style="border-radius: 20px; padding: 30px;"
            :before-close="handleClose">
            <template #title>
                <span class="text-xl font-semibold text-[#409eff]">Feedback</span>
            </template>
            <div class="py-3 flex flex-col gap-5">
                <div class="flex items-center gap-3">
                    <img class="w-[45px] h-[45px] rounded"
                        src="https://s3-alpha.figma.com/hub/file/2785854380/baef8be6-906e-4d6f-b619-6cf457aba1f0-cover.png"
                        alt="">
                    <div class="flex flex-col gap-0.5 items-start">
                        <span class="truncated font-bold text-base">{{ auction &&
                            auction.productName }}</span>
                        <div class="flex items-center gap-3">
                            <span class="text-xs">Seller: </span>
                            <span class="font-semibold">{{ auction.user && auction.user.fullName }}</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 feedback-rate">
                    <span class="font-semibold">Share your experience in scaling</span>
                    <el-rate v-model="feedback.rating" size="large" />
                </div>
                <el-input v-model="feedback.feedbackMessage" style="width: 100%" :rows="10" type="textarea"
                    placeholder="Share your thoughts about seller service and product to help other buyers" />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="sendFeedback">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss">
.feedback-rate {
    .el-rate__icon {
        font-size: 30px;
    }
}
</style>