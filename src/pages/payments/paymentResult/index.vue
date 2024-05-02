<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const auctionId = ref()
const isTransactionSuccess = ref(true)
const number = ref(0)
function getTransactionStatus(id) {
    switch (id) {
        case '00':
            isTransactionSuccess.value = true
            break;
        default:
            isTransactionSuccess.value = false;
            break;
    }
}
onBeforeMount(() => {
    if (route.query.vnp_TransactionStatus) {
        getTransactionStatus(route.query.vnp_TransactionStatus)
    }
    if (route.query.vnp_TxnRef) {
        number.value = route.query.vnp_TxnRef
    }
    auctionId.value = localStorage.getItem('auctionId')
})
</script>

<template>
    <div class="flex justify-center pt-[80px]">
        <div class="fixed top-0 right-0 bottom-0 left-0"></div>
        <div class="w-1/2 border shadow rounded-2xl relative z-1 bg-white">
            <el-result v-if="isTransactionSuccess" icon="success" title="Payment success">
                <template #extra>
                    <div class="flex flex-col items-center gap-5">
                        <span>Your order number is <span class="font-semibold text-[#409eff]">{{ number }}</span></span>
                        <el-button size="large" type="primary" @click="router.push('/auctions')">Continue
                            shopping</el-button>
                    </div>
                </template>
            </el-result>
            <el-result v-else icon="error" title="Payment Failed">
                <template #extra>
                    <div class="flex flex-col items-center gap-5">
                        <span>An error occurred during the transaction, please try again later</span>
                        <div class="flex items-center justify-center gap-2">
                            <el-button class="w-[150px]" size="large" @click="router.push('/')">Go to home page</el-button>
                            <el-button class="w-[150px]" size="large" type="primary" @click="router.push(`/payments/${auctionId}`)">Try again</el-button>
                        </div>
                    </div>
                </template>
            </el-result>
        </div>
    </div>
</template>