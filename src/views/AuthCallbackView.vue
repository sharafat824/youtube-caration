<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    const token = route.query.token;
    if (token) {
        authStore.token = token;
        localStorage.setItem('token', token);
        await authStore.fetchUser();
        router.push('/favorites');
    } else {
        router.push('/login?error=no_token');
    }
});
</script>

<template>
    <div class="h-screen bg-black flex items-center justify-center">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
            <p class="mt-4 text-white font-medium">Authenticating with Google...</p>
        </div>
    </div>
</template>
