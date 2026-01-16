<script setup>
import { computed } from 'vue';
import ShortPlayer from './ShortPlayer.vue';
import { useAuthStore } from '@/stores/auth';
import { useShortsStore } from '@/stores/shorts';
import { useSubscriptionStore } from '@/stores/subscriptions';

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
const subStore = useSubscriptionStore();

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    alert('Please login to like shorts');
    return;
  }
  await shortsStore.toggleFavorite(props.short.youtube_video_id);
};

const handleSubscribe = async () => {
    if (!authStore.isAuthenticated) {
        alert('Please login to subscribe to channels');
        return;
    }
    if (!props.short.channel_id) {
        console.error('Channel ID missing');
        return;
    }
    await subStore.toggleSubscription(props.short.channel_id);
};

const isSubscribed = computed(() => {
    return subStore.isSubscribed(props.short.channel_id);
});

const toggleMute = () => {
  shortsStore.setMuted(!shortsStore.isMuted);
};

const channelInitial = computed(() => {
    return props.short.channel_title ? props.short.channel_title.charAt(0) : '?';
});
</script>

<template>
  <div class="relative w-full h-full snap-start shrink-0 bg-black flex flex-col justify-center">
    
    <!-- Video Player & Interaction Area -->
    <div class="absolute inset-0 z-0" @click="toggleMute">
      <ShortPlayer 
        :video-id="short.youtube_video_id" 
        :should-play="isActive"
      />
    </div>

    <!-- Overlay Info -->
    <div class="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent pt-20 pointer-events-none">
      
      <div class="flex items-end justify-between pointer-events-auto">
        <div class="flex-1 mr-4">
            <div class="flex items-center space-x-2 mb-2">
                <div class="relative">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-sm font-bold text-white uppercase border-2 border-white/20">
                        {{ channelInitial }}
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="text-white font-semibold text-sm drop-shadow-md">
                        {{ short.channel_title }}
                    </span>
                    <button 
                        @click.stop="handleSubscribe" 
                        class="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter w-fit mt-0.5 hover:bg-red-500 active:scale-95 transition-all shadow-lg"
                    >
                        {{ isSubscribed ? 'Subscribed' : 'Subscribe' }}
                    </button>
                </div>
            </div>
          
            <h3 class="text-white text-base font-medium leading-tight mb-2 drop-shadow-md line-clamp-2">
                {{ short.title }}
            </h3>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-white/10 backdrop-blur-sm border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest">
                    #YouTubeShorts
                </span>
            </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="flex flex-col items-center space-y-5 pb-2">
          
          <!-- Like/React Button -->
          <button @click.stop="toggleFavorite" class="flex flex-col items-center group">
            <div class="w-12 h-12 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all hover:bg-black/50 active:scale-90 shadow-2xl">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 transition-all duration-300" :class="short.is_favorited ? 'text-red-500 fill-red-500 scale-125' : 'text-white'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-white mt-1.5 drop-shadow-md">{{ short.is_favorited ? 'Liked' : 'Like' }}</span>
          </button>

          <!-- Audio Toggle -->
          <button @click.stop="toggleMute" class="flex flex-col items-center group">
            <div class="w-12 h-12 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all hover:bg-black/50 active:scale-90 shadow-2xl">
                <svg v-if="shortsStore.isMuted" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5z" />
                </svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-white mt-1.5 drop-shadow-md">{{ shortsStore.isMuted ? 'Muted' : 'Unmute' }}</span>
          </button>

          <!-- Share Button -->
          <button class="flex flex-col items-center group">
            <div class="w-12 h-12 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all hover:bg-black/50 active:scale-90 shadow-2xl">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </div>
            <span class="text-[10px] font-black uppercase tracking-widest text-white mt-1.5 drop-shadow-md">Share</span>
          </button>

        </div>
      </div>
    </div>
  </div>
</template>
