<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full">
            <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">Create an account</h2>
            <form class="space-y-4" @submit.prevent="submit">
                <!-- Username input -->
                <div class="relative text-gray-400">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </span>
                    <input id="user" v-model="username" name="user" type="text" autocomplete="username"
                    class="w-full py-4 text-sm text-gray-900 rounded-md pl-10 border border-gray-300 focus:outline-none
                    focus:ring-indigo-500 focus:border-indigo-500 focus:z-10" placeholder="Username" required="" />
                </div>
                <!-- Password input -->
                <div class="relative text-gray-400">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </span>
                    <input id="password" v-model="password" name="password" type="password" autocomplete="new-password"
                    required="" class="w-full py-4 text-sm text-gray-900 rounded-md pl-10 border border-gray-300
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10" placeholder="Password"
                    />
                </div>
                <!-- Confirm Password input -->
                <div class="relative text-gray-400">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </span>
                    <input id="confirm-password" v-model="confirmPassword" name="confirm-password" type="password"
                    autocomplete="new-password"
                    required="" class="w-full py-4 text-sm text-gray-900 rounded-md pl-10 border border-gray-300
                    focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10" placeholder="Confirm Password" />
                </div>
                <!-- Register button -->
                <div>
                    <button
                        type="submit"
                        class="group relative w-full flex justify-center py-4 px-6 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Register
                    </button>
                </div>
            </form>
            <!-- Login link -->
            <div class="mt-2 text-sm text-gray-600">
                Already have an account?
                <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Log in</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '@kyvg/vue3-notification'
const notification = useNotification()
const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')

const submit = async () => {
    try {
        // Add your registration logic here
        // Use the username, password, and confirmPassword values
        // to send a registration request to your server or perform any necessary actions.

        // For example:
        // await registerApi({ username: username.value, password: password.value, confirmPassword: confirmPassword.value })

        // After successful registration, you can redirect the user to the login page or any other page.
        router.push({ name: 'login' })
    } catch (error) {
        notification.notify({
            type: 'error',
            title: 'Registration failed',
            text: 'An error occurred during registration. Please try again.',
        })
        console.error(error)
    }
}
</script>

<style lang="scss" scoped></style>
