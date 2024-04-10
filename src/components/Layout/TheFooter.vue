<template>
    <div class="footer px-[140px] py-8 border-t bg-[#f7f7f7]">
        <div class="footer-content flex items-start justify-between gap-4 text-xs">
            <div v-for="item in data" :key="item.id">
                <p class="font-bold">{{ item.title }}</p>
                <ul>
                    <li v-for="subItem in item.children" :key="subItem.id" class="flex items-center gap-1 pt-2">
                        <Icon v-show="subItem.icon" class="w-[20px] h-[20px]" :icon="subItem.icon" />
                        <p class="cursor-pointer text-[#767676] hover:underline">{{ subItem.name }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <ul class="footer-contact flex justify-center pt-[40px] text-[11px] text-[#767676] gap-1">
            <li>Copyright © 1995 - 2024 eBay Inc.All Rights Reserved.</li>
            <li v-for="(item, index) in dataContact" :key="index" class="underline">{{ item }}</li>
        </ul>
    </div>
</template>
<script setup>
import { ref } from "vue"

const data = ref([
    {
        id: 1,
        title: "Buy",
        children: [
            { name: 'Registration' },
            { name: 'eBay Money Back Guarantee' },
            { name: 'Bidding & buying help' },
            { name: 'Stores' }
        ]
    },
    {
        id: 2,
        title: "Sell",
        children: [
            { name: 'Start selling' },
            { name: 'Learn to sell' },
            { name: 'Affiliates' }
        ]
    },
    {
        id: 3,
        title: "Stay connected",
        children: [
            { name: "eBay's Blogs" },
            {
                name: 'Facebook',
                icon: "ic:baseline-facebook"
            },
            {
                name: 'Twitter',
                icon: "mdi:twitter"
            }
        ]
    },
    {
        id: 4,
        title: "About eBay",
        children: [
            { name: 'Company info' },
            { name: 'News' },
            { name: 'Investors' },
            { name: 'Careers' },
            { name: 'Government relations' },
            { name: 'Advertise with us' },
            { name: 'Policies' },
            { name: 'Verified Rights Owner (VeRO) Program' }
        ]
    },
    {
        id: 5,
        title: "Help & Contact",
        children: [
            { name: 'Seller Information Center' },
            { name: 'Contact us' }
        ]
    }

])
const dataContact = [
    'Accessibility,',
    'User Agreement,',
    'Privacy,',
    'Payments Terms of Use',,
    'Cookies,',
    'CA Privacy Notice,',
    'Your Privacy Choices and AdChoice.'
]

</script>