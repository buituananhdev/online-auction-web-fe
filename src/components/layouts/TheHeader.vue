<template>
    <div class="fixed top-0 left-0 h-[60px] w-full bg-white z-50 flex justify-center items-center px-5">
        <div class="container flex justify-between items-center">
            <div class="w-[20%]">
                <img class="w-[80px]" src="https://viblo.asia/logo_full.svg" alt="" />
            </div>
            <div class="w-[40%]">
                <span>Post</span>
                <span>Question</span>
            </div>
            <div class="w-[30%]">
                <input type="text" placeholder="Search...." />
            </div>
            <div class="w-[10%]">
                <button>Sign in</button>
                <button>Sign up</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { authStore } from '@/stores/auth.store'
const isPopupVisible = ref(false)
const isEditPopupVisible = ref(false)

const togglePopup = () => {
    isPopupVisible.value = !isPopupVisible.value
}

const exitPopupEdit = () => {
    isEditPopupVisible.value = false
}

const logout = () => {
    localStorage.clear()
    window.location.href = '/login'
}

const handleOutsideClick = (event) => {
    if (isPopupVisible.value) {
        const clickedElement = event.target
        const logoutContainer = document.querySelector('.logout-container')
        if (logoutContainer && !logoutContainer.contains(clickedElement)) {
            isPopupVisible.value = false
        }
    }
}

onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
})
</script>
