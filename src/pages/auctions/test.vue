<template>
    <div class="cl-upload">
        <h2>Upload an Image to Cloudinary</h2>
        <form v-on:submit.prevent="upload">
            <label for="file-input">Upload:</label>
            <input id="file-input" type="file" accept="image/png, image/jpeg" @change="handleFileChange($event)" />

            <button type="submit" :disabled="filesSelected < 1">Upload</button>
        </form>

        <section v-if="imageUrl">
            <img :src="imageUrl" :alt="imageUrl" />
        </section>

        <section>
            <ul v-if="errors.length > 0">
                <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
            </ul>
        </section>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { uploadImage } from "../../plugins/uploadImage.js";

const imageUrl = ref(null);
const errors = ref([]);
const file = ref();
const filesSelected = ref(0);

function handleFileChange(event) {
    console.log("handlefilechange", event.target.files);
    file.value = event.target.files[0];
    filesSelected.value = event.target.files.length;
}

async function upload() {
    try {
        imageUrl.value = await uploadImage(file.value);
        console.log("Upload successful:", imageUrl.value);
    } catch (error) {
        errors.value.push(error.response ? error.response.data.error.message : error.message);
        console.error("Upload error:", error);
    }
}
</script>
