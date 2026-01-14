<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Loader from '@/components/ui/Loader.vue';

const authStore = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const name = ref('');
const passwordConfirmation = ref('');

const handleSubmit = async () => {
    let success = false;
    if (isLogin.value) {
        success = await authStore.login({
            email: email.value,
            password: password.value
        });
    } else {
        success = await authStore.register({
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value
        });
    }

    if (success) {
        router.push('/');
    }
};
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-900 pb-20">
        <h1 class="text-3xl font-bold mb-8 text-red-600">Shorts App</h1>
        
        <div class="w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 class="text-xl font-semibold mb-6">{{ isLogin ? 'Login' : 'Create Account' }}</h2>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div v-if="!isLogin">
                    <label class="block text-sm font-medium mb-1">Name</label>
                    <input v-model="name" type="text" required class="w-full bg-gray-700 rounded border border-gray-600 p-2 focus:border-red-500 focus:outline-none" />
                </div>
                
                <div>
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input v-model="email" type="email" required class="w-full bg-gray-700 rounded border border-gray-600 p-2 focus:border-red-500 focus:outline-none" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input v-model="password" type="password" required class="w-full bg-gray-700 rounded border border-gray-600 p-2 focus:border-red-500 focus:outline-none" />
                </div>

                <div v-if="!isLogin">
                    <label class="block text-sm font-medium mb-1">Confirm Password</label>
                    <input v-model="passwordConfirmation" type="password" required class="w-full bg-gray-700 rounded border border-gray-600 p-2 focus:border-red-500 focus:outline-none" />
                </div>

                <div v-if="authStore.error" class="text-red-500 text-sm">
                    {{ authStore.error }}
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    :disabled="authStore.isLoading"
                >
                    <span v-if="!authStore.isLoading">{{ isLogin ? 'Sign In' : 'Sign Up' }}</span>
                    <Loader v-else class="!p-0 !h-6 !w-6 inline-block" />
                </button>
            </form>

            <div class="mt-4 text-center text-sm text-gray-400">
                <button @click="isLogin = !isLogin" class="hover:text-white underline">
                    {{ isLogin ? 'Need an account? Sign up' : 'Already have an account? Login' }}
                </button>
            </div>
        </div>
    </div>
</template>
