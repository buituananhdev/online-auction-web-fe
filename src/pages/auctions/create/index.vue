<script setup>
import { onBeforeMount, ref, reactive, computed } from 'vue'
import { getListCategories } from '../../../services/category.service'
import { addAuction } from '../../../services/auction.service'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'
import { uploadImage } from "../../../plugins/uploadImage.js";

const listCategories = ref([])
const isValids = ref([false, false, false, false, false])
const isShowSelectCondition = ref(false)
const router = useRouter()
const form = ref(null)
let currentAuction = reactive({
    productName: '',
    categoryId: null,
    condition: 1,
    description: '',
    startingPrice: null,
    maxPrice: null,
    endTime: new Date(),
    canReturn: false,
    mediaUrls: computed(() => fileList.value.map(x => x.url)),
})
const uploadLoading = ref(false)

const meta = ref({
    pageNumber: 1,
    totalPage: 1,
    pageSize: 16,
})

const handleSelectCondition = () => {
    isShowSelectCondition.value = true
}

const handleCloseModel = () => {
    isShowSelectCondition.value = false
}

const radioList = ref([
    {
        value: 1,
        text: 'New',
        description:
            "A brand-new, unused, unopened, undamaged item in its original packaging (where packaging is applicable). Packaging should be the same as what is found in a retail store, unless the item is handmade or was packaged by the manufacturer in non-retail packaging, such as an unprinted box or plastic bag. See the seller's listing for full details.",
    },
    {
        value: 2,
        text: 'Open Box',
        description:
            "An item in excellent, new condition with no wear. The item may be missing the original packaging or protective wrapping, or may be in the original packaging but not sealed. The item includes original accessories. The item may be a factory second. See the seller's listing for full details and description.",
    },
    {
        value: 3,
        text: 'Used',
        description:
            "An item that has been used previously. The item may have some signs of cosmetic wear, but is fully operational and functions as intended. This item may be a floor model or store return that has been used. See the seller's listing for full details and description of any imperfections.",
    },
])

function getConditionText(id) {
    switch (id) {
        case 1:
            return 'New'
        case 2:
            return 'Open box'
        case 3:
            return 'Used'
        default:
            return
    }
}

const validateField = (field, value, errorMessage) => {
    if (!value) {
        isValids.value[field] = false
        return new Error(errorMessage)
    } else if (field === 2 || field === 3) {
        if (value < 0) {
            isValids.value[field] = false
            return new Error(`${ field === 2 ? 'Starting Price' : 'Max Price'} must be greater than or equal to 0`)
        }
    } else if (field === 4) {
        if (!isFutureTime(value)) {
            isValids.value[field] = false
            return new Error(`End Time must be a future date`)
        }
    }
    isValids.value[field] = true
}

const validateProductName = (rule, value, callback) => {
    const errorMessage = 'Auction Name is required'
    const error = validateField(0, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const validateCategoryId = (rule, value, callback) => {
    const errorMessage = 'Category is required'
    const error = validateField(1, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const validateStartingPrice = (rule, value, callback) => {
    const errorMessage = 'Starting Price is required'
    const error = validateField(2, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const validateMaxPrice = (rule, value, callback) => {
    const errorMessage = 'Max Price is required'
    const error = validateField(3, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const isFutureTime = (timeString) => {
    const inputDate = new Date(timeString)
    if (isNaN(inputDate.getTime())) {
        return false
    }
    const now = new Date()
    return inputDate > now
}

const validateEndTime = (rule, value, callback) => {
    const errorMessage = 'End Time is required'
    const error = validateField(4, value, errorMessage)
    if (error) callback(error)
    else callback()
}

const rules = reactive({
    productName: [{ validator: validateProductName, trigger: 'blur' }],
    categoryId: [{ validator: validateCategoryId, required: true, trigger: 'blur' }],
    startingPrice: [{ validator: validateStartingPrice, trigger: 'blur' }],
    maxPrice: [{ validator: validateMaxPrice, trigger: 'blur' }],
    endTime: [{ validator: validateEndTime, trigger: 'blur' }],
})

const fileList = ref([]);

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove = (uploadFile, uploadFiles) => {
    console.log(uploadFile, uploadFiles)
}

const handlePictureCardPreview = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url
    dialogVisible.value = true
}

const getAllCategories = async () => {
    try {
        const res = await getListCategories(meta.value.pageNumber, meta.value.pageSize)
        listCategories.value = res.data.data
        console.log(listCategories)

        console.log(res.data.data)
    } catch (error) {
        console.log(error)
    }
}

const submit = async () => {
    try {
        const valid = await new Promise((resolve) => {
            form.value.validate((valid) => {
                resolve(valid)
            })
        })

        if (valid) {
            console.log('success')
            await addAuction(currentAuction)
            ElNotification({
                title: 'Create Auction',
                message: 'Create Auction Successfully!',
                type: 'success',
            });
            router.push('/seller-history')
            currentAuction = {}
        } else {
            console.log('error submit!')
            ElNotification({
                title: 'Create Auction',
                message: 'Create Auction Failed!',
                type: 'error',
            })
            return false
        }
    } catch (error) {
        console.log('error')
        ElNotification({
            title: 'Create Auction',
            message: 'Create Auction Failed!',
            type: 'error',
        })
        console.log(error)
    }
}

onBeforeMount(async () => {
    await getAllCategories()
})

const upload = async (file) => {
    fileList.value = fileList.value.filter(x => x.name !== file.file.name);
    try {
        const imageUrl = await uploadImage(file.file);
        fileList.value.push({ name: file.file.name, url: imageUrl });
        console.log("Upload successful:", fileList.value);
    } catch (error) {
        ElNotification.error({
            title: 'Upload Error',
            message: 'Failed to upload image!',
        });
        console.error("Upload error:", error);
    }
}

</script>

<template>
    <div class="w-full flex flex-col px-[72px] text-[#191919] z-0">
        <h1 class="font-bold text-2xl mt-[50px] px-6 w-full flex justify-start">Complete your listing</h1>
        <el-form @submit.prevent="submit" ref="form" :rules="rules" :model="currentAuction" label-width="auto">
            <div class="px-6 pt-8 flex flex-col pb-10 border-b-[1px]">
                <h2 class="font-bold mb-[10px]">PHOTOS & VIDEO</h2>
                <span class="text-sm font-semibold">Buyers want to see all details and angles.</span>
                <div class="mt-6">
                    <el-upload v-model:file-list="fileList" 
                        action="true"
                        :http-request="upload"
                        list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                </div>
            </div>
            <div class="px-6 pt-8 flex flex-col pb-10 border-b-[1px]">
                <h2 class="font-bold mb-[10px]">TITLE</h2>
                <div class="w-full">
                    <el-form-item prop="productName">
                        <el-input
                            v-model="currentAuction.productName"
                            maxlength="100"
                            placeholder="Please input"
                            show-word-limit
                            clearable
                            type="text"
                            size="large"
                            style="width: 908px"
                        />
                    </el-form-item>
                </div>
            </div>
            <div class="px-6 pt-8 flex flex-col pb-10 border-b-[1px]">
                <h2 class="font-bold mb-[10px]">ITEM CATEGORY</h2>
                <div class="w-full flex gap-10 justify-center items-center">
                    <span class="text-sm">Please select the product's category type!</span>
                    <el-form-item prop="categoryId" style="margin-bottom: 0">
                        <el-select
                            v-model="currentAuction.categoryId"
                            placeholder="Select"
                            size="large"
                            style="width: 500px"
                        >
                            <el-option
                                v-for="item in listCategories"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id"
                            />
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="px-6 pt-8 flex flex-col pb-10 border-b-[1px]">
                <h2 class="font-bold mb-[10px]">CONDITION</h2>
                <h3 class="font-semibold mt-4 mb-1">Item condition</h3>
                <button class="underline w-fit cursor-default hover:opacity-50" @click.prevent="handleSelectCondition">
                    {{ getConditionText(currentAuction.condition) }}
                </button>
                <span class="text-sm mt-4">Disclose all defects to prevent returns and earn better feedback.</span>
            </div>
            <div class="mx-6 pt-8 flex flex-col pb-10 border-b-[1px]">
                <h2 class="font-bold mb-[10px]">DESCRIPTION</h2>
                <QuillEditor
                    theme="snow"
                    v-model:content="currentAuction.description"
                    contentType="html"
                    placeholder="Write a detailed description of your item, or save time and let Al draft it for you"
                />
            </div>
            <div class="px-6 pt-8 flex flex-col pb-10 border-b-[1px]">
                <h2 class="font-bold mb-[10px]">PRICING</h2>
                <div class="flex gap-5">
                    <div class="flex flex-col">
                        <span class="mb-1 font-medium">Starting bid</span>
                        <el-form-item prop="startingPrice">
                            <el-input
                                v-model="currentAuction.startingPrice"
                                style="width: 240px"
                                placeholder="Please input"
                                :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            />
                        </el-form-item>
                    </div>
                    <div class="flex flex-col">
                        <span class="mb-1 font-medium">Buy It Now(optional)</span>
                        <el-form-item prop="maxPrice">
                            <el-input
                                v-model="currentAuction.maxPrice"
                                style="width: 240px"
                                placeholder="Please input"
                                :formatter="(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                                :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
                            />
                        </el-form-item>
                    </div>
                </div>
                <div class="flex flex-col mt-4">
                    <span class="mb-1 font-medium">Auction End Time</span>
                    <el-form-item prop="endTime" style="display: flex; flex-direction: row">
                        <div class="block">
                            <el-date-picker
                                v-model="currentAuction.endTime"
                                type="datetime"
                                placeholder="Select date and time"
                            />
                        </div>
                    </el-form-item>
                </div>
                <div class="w-full mt-4">
                    <el-checkbox
                        v-model="currentAuction.canReturn"
                        label="After receipt, returns allowed"
                        size="large"
                    />
                </div>
            </div>
            <div class="w-full my-10">
                <el-form-item style="display: flex; flex-direction: row">
                    <button
                        type="submit"
                        class="py-[13px] px-5 my-2 mx-auto bg-[#409EFF] text-white font-bold rounded-full min-w-[343px] flex justify-center items-center"
                    >
                        List it
                    </button>
                </el-form-item>
            </div>
        </el-form>
    </div>
    <div
        v-if="isShowSelectCondition"
        class="w-full bg-[rgba(17,24,32,0.7)] fixed top-0 bottom-0 left-0 right-0 h-screen z-10 flex items-center justify-center"
    >
        <div class="w-[616px] h-[80%] mx-[460px] mt-[50px] bg-white z-20 rounded-2xl flex flex-col">
            <div class="w-full flex justify-between border-b-[1px] border-gray-300">
                <div></div>
                <div class="text-xl font-bold my-4">Item condition</div>
                <button
                    class="text-[#409EFF] py-[10px] px-5 m-2 font-semibold hover:bg-slate-100 hover:cursor-default rounded-full"
                    @click="handleCloseModel"
                >
                    Done
                </button>
            </div>
            <div class="flex flex-col px-8 py-4 overflow-hidden">
                <el-radio-group v-model="currentAuction.condition" v-for="item in radioList" :key="item.value">
                    <div class="flex-col flex">
                        <el-radio :value="item.value" class="my-[60px]">
                            <span class="text-[#191919] font-bold">
                                {{ item.text }}
                            </span>
                            <div class="text-[#707070] flex flex-wrap whitespace-normal">{{ item.description }}</div>
                        </el-radio>
                    </div>
                </el-radio-group>
            </div>
        </div>
    </div>
</template>

<style scoped>
.demo-datetime-picker {
    display: flex;
    width: 100%;
    padding: 0;
    flex-wrap: wrap;
}

.demo-datetime-picker .block {
    padding: 30px 0;
    text-align: center;
    border-right: solid 1px var(--el-border-color);
    flex: 1;
}

.demo-datetime-picker .block:last-child {
    border-right: none;
}

.demo-datetime-picker .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-bottom: 20px;
}
</style>
