<template>
    <div>
        <h3>{{ title }}</h3>
        <div class="table-responsive">
            <el-form ref="createOrder" :model="formData" :rules="rules" method="post" action="create_payment_url"
                @submit.prevent="handleSubmit">
                <el-form-item label="Số tiền" prop="amount">
                    <el-input v-model="formData.amount" placeholder="Số tiền"></el-input>
                </el-form-item>

                <el-form-item label="Chọn Phương thức thanh toán:" prop="bankCode">
                    <el-radio v-model="formData.bankCode" label="">Cổng thanh toán VNPAYQR</el-radio>
                    <el-radio v-model="formData.bankCode" label="VNBANK">Thanh toán qua ATM-Tài khoản ngân hàng nội
                        địa</el-radio>
                    <el-radio v-model="formData.bankCode" label="INTCARD">Thanh toán qua thẻ quốc tế</el-radio>
                </el-form-item>

                <el-form-item label="Ngôn ngữ" prop="language">
                    <el-radio v-model="formData.language" label="vn">Tiếng việt</el-radio>
                    <el-radio v-model="formData.language" label="en">Tiếng anh</el-radio>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" native-type="submit">Thanh toán</el-button>
                </el-form-item>
            </el-form>
        </div>
        <p>&nbsp;</p>
        <QuillEditor theme="snow" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import moment from 'moment';
import querystring from 'qs';
import CryptoJS from 'crypto-js';

const formData = ref({
    amount: '200000',
    bankCode: '',
    language: 'vn'
});

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

const title = 'Thông tin thanh toán';

const handleSubmit = () => {
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = '127.0.0.1'; // You need to get the real IP address here

    let tmnCode = import.meta.env.VITE_VNP_TMN_CODE;
    let secretKey = import.meta.env.VITE_VNP_HASH_SECRET;
    let vnpUrl = import.meta.env.VITE_VNP_URL;
    let returnUrl = import.meta.env.VITE_VNP_RETURN_URL;
    let orderId = moment(date).format('DDHHmmss');
    let amount = formData.value.amount;
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
</script>