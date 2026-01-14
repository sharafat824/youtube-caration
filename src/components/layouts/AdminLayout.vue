<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
        <!-- Sidebar -->
        <aside class="w-full md:w-64 bg-gray-800 p-4 flex flex-col">
            <h2 class="text-xl font-bold text-red-500 mb-8">Admin Dashboard</h2>
            
            <nav class="space-y-2 flex-col flex">
                <RouterLink to="/admin/categories" active-class="bg-gray-700 text-white" class="block py-2 px-4 rounded text-gray-300 hover:bg-gray-700">
                    Manage Categories
                </RouterLink>
                <RouterLink to="/admin/shorts" active-class="bg-gray-700 text-white" class="block py-2 px-4 rounded text-gray-300 hover:bg-gray-700">
                    Manage Shorts
                </RouterLink>
                <div class="border-t border-gray-700 my-4"></div>
                <RouterLink to="/" class="block py-2 px-4 rounded text-gray-400 hover:text-white">
                    Back to App
                </RouterLink>
            </nav>

            <div class="mt-auto pt-8">
                 <button @click="authStore.logout" class="text-gray-400 hover:text-white text-sm">Logout</button>
            </div>
        </aside>

        <!-- Content -->
        <main class="flex-1 p-6 overflow-y-auto">
            <RouterView />
        </main>
    </div>
</template>
