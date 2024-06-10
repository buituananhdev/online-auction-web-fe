<template>
    <div class="my-5 px-[50px] pb-5 flex flex-col text-[#333333] shadow-md">
        <span class="text-2xl font-semibold my-4">Statistics</span>
        <div class="flex gap-4 items-center justify-center">
            <div class="flex flex-col gap-2 w-4/5">
                <div class="flex items-center gap-8">
                    <span class="text-sm w-1/5">Total products :</span>
                    <span class="font-semibold text-lg">{{ revenue.totalAuctions }}</span>
                </div>
                <div class="flex items-center gap-8">
                    <span class="text-sm w-1/5">Total products sold :</span>
                    <span class="font-semibold text-lg">{{ revenue.totalSoldAuctions }}</span>
                </div>
                <div class="flex items-center gap-8">
                    <span class="text-sm w-1/5">Revenue :</span>
                    <span class="font-semibold text-2xl text-[#409eff]">{{ formatNumber(revenue.totalRevenue) }} VNĐ</span>
                </div>
            </div>
            <img src="../../assets/images/money.png" alt="money" class="w-1/5 rounded-full">
        </div>

    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getRevenue } from '../../services/auction.service';
import { formatNumber } from '../../utils';

const revenue = ref({})

async function getSellerRevenue() {
    try {
        const response = await getRevenue()
        revenue.value = response.data
    } catch (error) {
        console.log(error)
    }
}
onMounted(() => {
    getSellerRevenue()
})
</script>