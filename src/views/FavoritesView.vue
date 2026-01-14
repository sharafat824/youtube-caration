<script setup>
import { ref, onMounted } from 'vue';
import api from '@/axios';
import ShortCard from '@/components/shorts/ShortCard.vue';
import Loader from '@/components/ui/Loader.vue';

const favorites = ref([]);
const isLoading = ref(true);
const activeShortIndex = ref(null);

const fetchFavorites = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/favorites');
        // Transform structure to match ShortCard expectation
        favorites.value = response.data.data.map(fav => ({
            ...fav.short,
             // Ensure favorite status is visually reflected because it comes from favorites endpoint
            is_favorited: true 
        }));
    } catch (err) {
        console.error('Failed to load favorites', err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchFavorites();
});
</script>

<template>
    <div class="min-h-screen bg-black pb-20">
        <div class="p-4 border-b border-gray-800">
            <h1 class="text-xl font-bold">Your Favorites</h1>
        </div>

        <div v-if="isLoading" class="flex justify-center mt-10">
            <Loader />
        </div>

        <div v-else-if="favorites.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
            <p>No favorites yet.</p>
            <p class="text-sm">Go watch some shorts!</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
             <!-- Not using full screen player here, maybe a grid layout is better for "Library" view? 
                  For now, let's keep it simple grid. Clicking could open a modal player but that's complex.
                  Let's just list them nicely. -->
             
             <div v-for="short in favorites" :key="short.id" class="aspect-[9/16] relative bg-gray-900">
                 <!-- Simple Preview -->
                 <img :src="short.thumbnail_url" class="absolute inset-0 w-full h-full object-cover opacity-60" />
                 <div class="absolute bottom-2 left-2 right-2">
                     <p class="text-sm font-bold truncate">{{ short.title }}</p>
                 </div>
                 
                 <!-- Play Overlay -->
                 <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                 </div>
             </div>
        </div>
    </div>
</template>
