<template>
    <div class="w-[80%] h-[80%] border-2 rounded-xl">
        <div class="flex justify-between px-4 rounded-t-xl bg-white">
            <div class="flex gap-7 items-center px-6 py-3 ">
                <Icon :icon="icons[auction.productStatus]" />
                <div class="flex flex-col">
                    <span class="font-semibold">{{ ProductStatusNames[auction.productStatus] }}</span>
                    <div class="flex gap-8">
                        <span>Product Name: {{ auction.productName }}</span>
                        <span>Bid count: {{ auction.bidCount }}</span>
                        <span>Condition: {{ ConditionNames[auction.condition] }}</span>
                    </div>
                </div>
            </div>
            <el-button class="my-auto">View detail</el-button>
        </div>
        <div class=" bg-white border-t-2 rounded-b-xl">
            <div class="flex gap-5 px-4 py-2 ">
                <div class="demo-image__preview">
                    <el-image
                    style="width: 200px; height: 200px; border-radius: 6px;"
                    :src="url"
                    :zoom-rate="1.2"
                    :max-scale="7"
                    :min-scale="0.2"
                    :preview-src-list="srcList"
                    :initial-index="4"
                    fit="cover"
                    />
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col">
                        <span class="font-semibold text-base mb-2">Delivered on Tue 20 Dec</span>
                        <span>Date created: {{ auction.dateCreated.split("T")[0] }}</span>
                        <span>Return window closed on: {{ auction.endTime.split("T")[0] }}</span>
                        <span>Category: {{ auction.category }}</span>
                    </div>
                    <div class="flex-col flex">
                        <span class="mt-1">Price: {{ auction.currentPrice }}$</span>
                    </div>
                    <span>Buy by: {{ auction.user }}</span>
                </div>
                <div class="flex justify-end flex-auto mr-10">
                    <el-button class="my-auto" type="primary">Accept</el-button>
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