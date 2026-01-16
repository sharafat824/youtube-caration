<script setup>
import { ref, onMounted } from 'vue';
import api from '@/axios';
import Loader from '@/components/ui/Loader.vue';
import { useRouter } from 'vue-router';

const favorites = ref([]);
const isLoading = ref(true);
const router = useRouter();

const fetchFavorites = async () => {
    isLoading.value = true;
    try {
        const response = await api.get('/favorites');
        favorites.value = response.data.data;
    } catch (err) {
        console.error('Failed to load favorites', err);
    } finally {
        isLoading.value = false;
    }
};

const goToShort = (youtubeVideoId) => {
    // Navigate home but with specific focus?
    // For now just going home is what we have, but we could pass the ID
    router.push({ path: '/', query: { hashtag: 'viral' } }); // Placeholder logic
};

onMounted(() => {
    fetchFavorites();
});
</script>

<template>
    <div class="min-h-screen bg-black pb-20">
        <div class="p-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-black z-20">
            <h1 class="text-xl font-bold text-white">Your Favorites</h1>
            <span v-if="favorites.length > 0" class="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">{{ favorites.length }}</span>
        </div>

        <div v-if="isLoading" class="flex justify-center mt-10">
            <Loader />
        </div>

        <div v-else-if="favorites.length === 0" class="flex flex-col items-center justify-center mt-20 text-gray-500">
            <div class="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-4">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <p class="font-medium">No favorites yet.</p>
            <router-link to="/discover" class="mt-4 text-blue-400 hover:underline text-sm">Explore hashtags</router-link>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2">
             <div 
                v-for="short in favorites" 
                :key="short.youtube_video_id" 
                class="aspect-[9/16] relative bg-gray-900 rounded-lg overflow-hidden group cursor-pointer"
                @click="goToShort(short.youtube_video_id)"
             >
                 <!-- Thumbnail -->
                 <img :src="short.thumbnail_url" class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
                 
                 <!-- Overlay -->
                 <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 p-3 flex flex-col justify-end">
                     <p class="text-xs font-bold text-white line-clamp-2 drop-shadow-md">{{ short.title }}</p>
                     <p class="text-[10px] text-gray-300 mt-1 truncate">{{ short.channel_title }}</p>
                 </div>
                 
                 <!-- Play Icon Overlay -->
                 <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div class="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                 </div>
             </div>
        </div>
    </div>
</template>
