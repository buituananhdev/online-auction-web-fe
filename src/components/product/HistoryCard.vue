<template>
    <div class="w-full h-[80%] gap-4 flex flex-col">
        <div class="flex justify-between px-5 bg-[#f7f7f7] text-[#191919] font-medium">
            <div class="flex gap-4 items-center py-3">
                <Icon :icon="icons[auction.productStatus]" />
                <div class="flex flex-col">
                    <span class="font-bold">{{ ProductStatusNames[auction.productStatus] }}</span>
                    <div class="flex gap-10">
                        <span>Product Name: {{ auction.productName.length > 30 ? auction.productName.slice(0,30) + '...': auction.productName}}</span>
                        <span>Order total: <span class="font-bold">{{ auction.currentPrice }}$</span></span>
                        <span>Condition: {{ ConditionNames[auction.condition] }}</span>
                    </div>
                </div>
            </div>
            <el-button :key="primary" style="padding: 18px 40px;" class="my-auto">View order details</el-button>
        </div>
        <div class="h-fit font-medium bg-[#f7f7f7]">
            <div class="flex gap-5">
                <div class="demo-image__preview">
                    <el-image
                    style="width: 200px; height: 200px;"
                    :src="url"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="srcList"
                    :initial-index="4"
                    fit="cover"
                    />
                </div>
                <div class="flex flex-col gap-2 mt-1 mb-3 text-sm">
                    <div class="flex flex-col">
                        <span class="font-bold text-base mb-1">Delivered on Tue 20 Dec</span>
                        <span>Date created: {{ auction.dateCreated.split("T")[0] }}</span>
                        <span>Return window closed on: {{ auction.endTime.split("T")[0] }}</span>
                    </div>
                    <div class="flex flex-col text-sm">
                        <span >Category: {{ auction.category.categoryName }}</span>
                        <span>Bid count: {{ auction.bidCount }}</span>
                    </div>
                    <div class="flex-col flex">
                        <span class="mt-1 text-sm">Price: {{ auction.currentPrice }}$</span>
                    </div>
                    <span class="text-sm text-[#707070]">Buy by: <span class="underline text-[#3665f3]">{{ auction.user.fullName }}</span></span>
                </div>
                <div class="flex justify-end flex-auto mr-5">
                    <el-button style="min-width: 196px; padding: 18px 0;" class="my-auto" type="primary">More actions</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

defineProps({
    auction: Object,
})

const url =
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

const ProductStatusNames = {
    1: 'Available',
    2: 'Sold',
    3: 'Deleted',
    4: 'Canceled',
    5: 'Pending Publish',
};

const icons = {
    1: 'fluent:presence-available-12-filled',
    2: 'ep:sold-out', 
    3: 'material-symbols:delete', 
    4: 'fluent:presence-dnd-12-filled', 
    5: 'material-symbols:pending-actions',
};

const ConditionNames = {
    1: 'New',
    2: 'Open Box',
    3: 'Used',
};

</script>

<style>

</style>