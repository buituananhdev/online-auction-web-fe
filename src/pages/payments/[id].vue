<template>
    <div class="h-full">
        <div class="payment-address"></div>
        <div class="w-full p-3 border-b">
            <div class="flex items-center gap-2">
                <el-icon color="#409efc" :size="20">
                    <LocationFilled />
                </el-icon>
                <span class="text-[#409efc] font-semibold text-xl">Delivery Address</span>
            </div>
            <div class="flex flex-col gap-2 py-4">
                <div class="flex items-center gap-4">
                    <span class="font-bold">{{ user.name }}</span>
                    <span class="font-semibold">{{ user.phoneNumber }}</span>
                </div>
                <div class="flex items-center gap-4">
                    <span class="text-sm text-[#505050]">Address: </span>
                    <span>{{ user.address }}</span>
                </div>
            </div>
        </div>
        <div v-show="auction.user" class="p-4 w-full border-b flex flex-col gap-3">
            <div class="flex gap-2 items-center justify-between">
                <p class="w-3/5 font-semibold">Product Ordered</p>
                <p class="text-[#bbb] w-1/6">Unit price</p>
                <p class="text-[#bbb] w-1/6">Amount</p>
                <p class="text-[#bbb] w-1/6">Item Subtotal</p>
            </div>
            <div class="flex gap-2 items-center justify-between">
                <div class="py-3 w-3/5">
                    <div class="flex items-center gap-2 mb-3">
                        <img class="w-[24px] h-[24px] rounded-full"
                            src="https://scontent.fhan2-5.fna.fbcdn.net/v/t39.30808-6/426587256_1430509044210042_7946706195478323343_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGJAwy2cy3ozNO6_7jEhyDyXu52TFDhi9Ve7nZMUOGL1VpuR-3ErXuUitueR_3NPEQEtrYu0xsOzygnsODxm_yg&_nc_ohc=0e39l21fNvAQ7kNvgGJVPV2&_nc_ht=scontent.fhan2-5.fna&oh=00_AfC4aQbwZPNwmoW1ZcWkMCwJk87XqG726tgRAPTIcKnLsQ&oe=6637E9D0"
                            alt="">
                        <span>{{ auction.user && auction.user.fullName }}</span>
                    </div>
                    <div>
                        <div class="flex items-center gap-3">
                            <img class="w-[45px] h-[45px] rounded"
                                src="https://s3-alpha.figma.com/hub/file/2785854380/baef8be6-906e-4d6f-b619-6cf457aba1f0-cover.png"
                                alt="">
                            <div class="flex flex-col gap-0.5">
                                <el-text truncated class="font-bold text-base">{{ auction &&
                                    auction.productName }}</el-text>
                                <span class="text-[8px] w-fit text-[red] p-[4px] border border-[red] rounded-lg">{{
                                    auction.canReturn && 'You can return item' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="w-1/6">$ {{ auction.currentPrice }}</p>
                <p class="w-1/6">1</p>
                <span class="w-1/6">$ {{ auction.currentPrice }}</span>
            </div>
        </div>
        <div class="p-3 w-full border-b flex flex-col gap-3 h-[32%]">
            <span class="w-3/5 font-semibold">Payment Methods</span>
            <div class="flex gap-2 py-2 items-center justify-between h-[96%]">
                <el-radio-group v-model="formData.bankCode" class="ml-4">
                    <el-radio label="">
                        <el-text color="#409EFF">VNPAYQR payment gateway</el-text>
                        <img width="170" class="border rounded-xl h-[80px] my-2"
                            src="https://www.namabank.com.vn/Data/Sites/1/News/4227/vnpay-tra-gop.png" alt="">
                    </el-radio>
                    <el-radio label="VNBANK">
                        <el-text color="#409EFF">Payment via ATM - Domestic bank</el-text>
                        <img width="170" class="border h-[80px] rounded-xl px-6 py-4 my-2"
                            src="../../assets/images/noidia.png"
                            alt="">
                    </el-radio>
                    <el-radio label="INTCARD">
                        <el-text color="#409EFF">Payment via international card</el-text>
                        <img width="170" class="border rounded-xl h-[80px] my-2"
                            src="../../assets/images/visa.png" alt="">
                    </el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="flex justify-end py-4">
            <el-button @click="handleSubmit" type="primary" class="w-[200px]" size="large" native-type="submit">Thanh toán</el-button>
        </div>
        <p>&nbsp;</p>
    </div>
</template>

<script setup>
import { onMounted, ref, computed, onBeforeMount } from 'vue';
import moment from 'moment';
import querystring from 'qs';
import CryptoJS from 'crypto-js';
import { LocationFilled } from '@element-plus/icons-vue'
import { useAuctionStore } from '../../stores/auction.store'

const formData = ref({
    amount: '200000',
    bankCode: '',
    language: 'vn'
});

const loading = computed(() => {
    return !Boolean(auction.value.user)
})

const rules = ref({
    amount: [
        { required: true, message: 'Vui lòng nhập số tiền', trigger: 'blur' }
    ],
    bankCode: [
        { required: true, message: 'Vui lòng chọn phương thức thanh toán', trigger: 'change' }
    ],
    language: [
        { required: true, message: 'Vui lòng chọn ngôn ngữ', trigger: 'change' }
    ]
});
const useAuction = useAuctionStore()
const auction = ref({})
const title = 'Thông tin thanh toán';
const user = ref({
    name: 'Phan Thi Thanh Nhan',
    phoneNumber: '0388291839',
    address: 'Số 8, Hòa Khánh Bắc, Bàu Vàng 1, Liên Chiểu, Đà Nẵng'
})

const handleSubmit = () => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = '127.0.0.1'; // You need to get the real IP address here

    let tmnCode = import.meta.env.VITE_VNP_TMN_CODE;
    let secretKey = import.meta.env.VITE_VNP_HASH_SECRET;
    let vnpUrl = import.meta.env.VITE_VNP_URL;
    let returnUrl = import.meta.env.VITE_VNP_RETURN_URL;
    let orderId = moment(date).format('DDHHmmss');
    let amount = auction.value.currentPrice;
    let bankCode = formData.value.bankCode;

    let locale = formData.value.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    // let hmac = VueCryptojs.HmacSHA512(signData, secretKey).toString(VueCryptojs.enc.Hex);
    let hmac = CryptoJS.HmacSHA512(signData, secretKey).toString(CryptoJS.enc.Hex);
    vnp_Params['vnp_SecureHash'] = hmac;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    window.location.href = vnpUrl;
}

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

onBeforeMount(() => {
    auction.value = useAuction.detailAuction
    console.log('auction', useAuction.detailAuction)
})
</script>

<style scoped>
.payment-address {
    background-image: repeating-linear-gradient(45deg, #6fa6d6, #6fa6d6 33px, transparent 0, transparent 41px, #f18d9b 0, #f18d9b 74px, transparent 0, transparent 82px);
    background-position-x: -30px;
    background-size: 116px 3px;
    height: 3px;
    width: 100%;
}
</style>