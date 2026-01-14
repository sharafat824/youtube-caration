<script setup>
import { computed } from 'vue';
import ShortPlayer from './ShortPlayer.vue';
import { useAuthStore } from '@/stores/auth';
import { useShortsStore } from '@/stores/shorts';

const props = defineProps({
  short: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
const shortsStore = useShortsStore();

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    // Ideally prompt login
    alert('Please login to favorite shorts');
    return;
  }
  await shortsStore.toggleFavorite(props.short.id);
};
</script>

<template>
  <div class="relative w-full h-full snap-start shrink-0 bg-black flex flex-col justify-center">
    
    <!-- Video Player -->
    <div class="absolute inset-0 z-0">
      <ShortPlayer 
        :video-id="short.youtube_video_id" 
        :should-play="isActive"
      />
    </div>

    <!-- Overlay Info -->
    <div class="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent pt-20">
      
      <div class="flex items-end justify-between">
        <div class="flex-1 mr-4">
            <div class="flex items-center space-x-2 mb-2">
                <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {{ short.youtube_channel_name.charAt(0) }}
                </div>
                <span class="text-white font-semibold text-sm drop-shadow-md">
                    {{ short.youtube_channel_name }}
                </span>
            </div>
          
            <h3 class="text-white text-base font-medium leading-tight mb-2 drop-shadow-md line-clamp-2">
                {{ short.title }}
            </h3>

            <div class="flex flex-wrap gap-2">
                <span v-if="short.category" class="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs text-white">
                    {{ short.category.name }}
                </span>
            </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="flex flex-col items-center space-y-6 pb-2">
          
          <!-- Favorite Button -->
          <button @click="toggleFavorite" class="flex flex-col items-center group">
            <div class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-colors" :class="short.is_favorited ? 'text-red-500 fill-red-500' : 'text-white'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <span class="text-xs text-white mt-1 shadow-black drop-shadow-md">Fav</span>
          </button>

          <!-- Share Button (Dummy) -->
          <button class="flex flex-col items-center group">
            <div class="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform active:scale-90">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </div>
            <span class="text-xs text-white mt-1 shadow-black drop-shadow-md">Share</span>
          </button>

        </div>
      </div>
    </div>
  </div>
</template>
