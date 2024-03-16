<template>
    <el-tooltip class="box-item" effect="light" content="Left Center prompts info" placement="right">
            <template #content>
                <div>
                    <div>
                        <p class="text-xl font-bold">Item specials:</p>
                        <p>loremasjdhsfasflaskkkkkkkkk</p>
                    </div>
                </div>
            </template>
            <el-card style="max-width: 320px">
                <img
                    src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                    style="width: 100%; height: 220px"
                />
                <template #footer>
                    <div class="flex flex-col gap-2">
                        <p>Apple iPhone 11 64GB Fully Unlocked Smartphone - Purple</p>
                        <p class="text-2xl font-bold">$ 123</p>
                        <div>
                            <el-text tag="ins">Bids: 14</el-text>
                            <el-text> Ends in 2d 1hMonday, 05:40 PM</el-text>
                        </div>
                        <el-button type="primary" size="large" class="w-full">Place Bid</el-button>
                    </div>
                </template>
            </el-card>
        </el-tooltip>
</template>
<script setup>
import { ElCard, ElText, ElTooltip } from 'element-plus'
</script>