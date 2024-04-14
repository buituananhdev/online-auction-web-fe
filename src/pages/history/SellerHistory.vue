<template>
  <div class="w-[1100px]">
    <div class="w-full bg-red-500 h-[800px]">
        <div class="flex justify-between gap-5 mx-5 pt-5">
            <span class="font-bold text-2xl">Sold</span>
            <div class="w-1/2">
                <el-input
                    v-model="searchValue"
                    style="border-radius: 30px"
                    placeholder="Search..."
                    class="input-with-select"
                    @keyup.enter="handleClickSearch"
                >
                    <template #append>
                        <el-button :icon="SearchIcon" @click="handleClickSearch" />
                    </template>
                </el-input>
            </div>
        </div>
        <div class="mt-5 mx-5 flex flex-col gap-5">
            <span class="font-semibold text-xl">Order</span>
            <div class="bg-pink-300">
                <div class="flex justify-between px-10 bg-gray-300">
                    <div class="flex gap-7">
                        <span>icon</span>
                        <div class="flex flex-col">
                            <span>Delivered</span>
                            <div class="flex gap-4">
                                <span>AAAAAAAA</span>
                                <span>AAAAAAAA</span>
                                <span>AAAAAAAA</span>
                            </div>
                        </div>
                    </div>
                    <el-button class="my-auto">View detail</el-button>
                </div>
                <div class="mt-4 bg-gray-300">
                    <div class="flex gap-5">
                        <div class="demo-image__preview">
                            <el-image
                            style="width: 200px; height: 200px"
                            :src="url"
                            :zoom-rate="1.2"
                            :max-scale="7"
                            :min-scale="0.2"
                            :preview-src-list="srcList"
                            :initial-index="4"
                            fit="cover"
                            />
                        </div>
                        <div class="flex flex-col gap-5">
                            <div class="flex flex-col">
                                <span class="font-semibold text-base">Delivered on Tue 20 Dec</span>
                                <span>Return window closed on 18 Feb</span>
                                <span>Return window closed on 18 Feb</span>
                            </div>
                            <div class="flex-col flex">
                                <span>AAAAAAAAAAAA</span>
                                <span class="mt-1">5$</span>
                            </div>
                            <span>Buy by: BBBBBBBBBBBB</span>
                        </div>
                        <div class="flex justify-end flex-auto mr-10">
                            <el-button class="my-auto" type="primary">CCCCCCCCCCCCCCCCCCCCC</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const searchValue = ref('')
const SearchIcon = Search
const router = useRouter()
const route = useRoute()

const url =
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
const srcList = [
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
  'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
  'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
  'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
]

const handleClickSearch = () => {
    if (searchValue.value.trim() !== '') {
        router.push({
            path: '/auctions',
            query: { search: searchValue.value.trim() },
        })
    } else {
        const { search, ...queryWithoutSearch } = route.query
        router.push({ path: '/auctions', query: queryWithoutSearch })
    }
}
onMounted(() => {
    if (route.query.search) {
        searchValue.value = route.query.search.toString()
    }
})
</script>

<style scoped>
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 300px;
}
</style>