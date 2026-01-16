<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};
</script>

<template>
    <div class="min-h-screen bg-[#0f1115] text-[#e1e1e6] flex font-sans overflow-hidden">
        
        <!-- Mobile Overlay -->
        <div 
            v-if="isSidebarOpen" 
            @click="isSidebarOpen = false"
            class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        ></div>

        <!-- Sidebar -->
        <aside 
            :class="[
                'fixed md:static inset-y-0 left-0 w-64 bg-[#0a0c10] border-r border-white/5 p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out shadow-2xl',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            ]"
        >
            <div class="mb-10 flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-black bg-gradient-to-br from-red-500 to-orange-400 bg-clip-text text-transparent tracking-tighter uppercase italic">
                        Studio
                    </h2>
                    <p class="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Shorts Curation</p>
                </div>
                <!-- Close Button (Mobile) -->
                <button @click="isSidebarOpen = false" class="md:hidden text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <nav class="space-y-1.5 flex-col flex flex-1">
                <RouterLink 
                    to="/admin/hashtags" 
                    active-class="sidebar-active" 
                    class="sidebar-link group"
                    @click="isSidebarOpen = false"
                >
                    <div class="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                        </svg>
                    </div>
                    <span class="font-medium tracking-tight">Hashtags</span>
                </RouterLink>

                <RouterLink 
                    to="/admin/channels" 
                    active-class="sidebar-active" 
                    class="sidebar-link group"
                    @click="isSidebarOpen = false"
                >
                    <div class="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all mr-3">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="font-medium tracking-tight">Channels</span>
                </RouterLink>

                <div class="my-6 border-t border-white/5 opacity-50"></div>

                <RouterLink to="/" class="sidebar-link group text-gray-500 hover:text-white mt-auto">
                    <div class="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all mr-3">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <span class="font-medium text-sm tracking-tight">Exit Studio</span>
                </RouterLink>
            </nav>

            <div class="pt-6 mt-6 border-t border-white/5">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-black">
                            {{ authStore.user?.name?.charAt(0) || 'A' }}
                        </div>
                        <div class="overflow-hidden max-w-[100px]">
                            <p class="text-xs font-bold truncate text-gray-200">{{ authStore.user?.name || 'Admin' }}</p>
                            <p class="text-[9px] text-gray-500 uppercase font-bold tracking-tighter">Administrator</p>
                        </div>
                    </div>
                    <button @click="authStore.logout" class="text-gray-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 flex flex-col h-screen overflow-hidden bg-grid-white/[0.02]">
            <!-- Mobile Header -->
            <header class="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0c10]/80 backdrop-blur-md sticky top-0 z-30">
                <h2 class="text-lg font-black bg-gradient-to-br from-red-500 to-orange-400 bg-clip-text text-transparent tracking-tighter uppercase italic">
                    Studio
                </h2>
                <button @click="toggleSidebar" class="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </header>

            <div class="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-32">
                <div class="max-w-6xl mx-auto">
                    <RouterView />
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.sidebar-link {
    @apply flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/[0.03] select-none;
}

.sidebar-active {
    @apply bg-white/[0.05] text-white border border-white/5 shadow-inner;
}

.sidebar-active div {
    @apply shadow-lg transform scale-105;
}

.sidebar-active span {
    @apply font-semibold;
}

/* Background Grid Pattern */
.bg-grid-white\/\[0\.02\] {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='white' stroke-opacity='0.02'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E");
}
</style>
