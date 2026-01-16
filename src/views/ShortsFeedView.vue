<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';
import { useShortsStore } from '@/stores/shorts';
import { useRoute } from 'vue-router';
import ShortCard from '@/components/shorts/ShortCard.vue';
import Loader from '@/components/ui/Loader.vue';

const shortsStore = useShortsStore();
const route = useRoute();

const feedContainer = ref(null);
const activeShortIndex = ref(0);

// Observer for active video detection
let observer = null;

const setupObserver = () => {
    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.index);
                activeShortIndex.value = index;
                
                // Load more if we're near the end (e.g., 3 items from bottom)
                if (index >= shortsStore.shorts.length - 3 && !shortsStore.isLoading && shortsStore.nextPageToken) {
                    loadMore();
                }
            }
        });
    }, {
        threshold: 0.6 // 60% of signal must be visible
    });

    // Observe all short cards
    nextTick(() => {
        const cards = document.querySelectorAll('.short-card');
        cards.forEach((card) => observer.observe(card));
    });
};

const loadShorts = async (refresh = false) => {
    const filters = {
        hashtag: route.query.hashtag || null,
        channelId: route.query.channelId || null
    };
    
    await shortsStore.fetchShorts(filters, refresh);
    
    nextTick(() => {
        setupObserver();
    });
};

const loadMore = async () => {
    const filters = {
        hashtag: route.query.hashtag || null,
        channelId: route.query.channelId || null
    };
    
    await shortsStore.fetchShorts(filters, false);
    
    nextTick(() => {
        setupObserver();
    });
};

// Watch for any filter changes in URL
watch(() => route.query, async (newQuery) => {
    activeShortIndex.value = 0;
    if(feedContainer.value) feedContainer.value.scrollTop = 0;
    await loadShorts(true);
}, { deep: true });

onMounted(async () => {
    await loadShorts();
});
</script>

<template>
    <div 
        ref="feedContainer" 
        class="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black pb-16 scroll-smooth no-scrollbar"
    >
        <div v-if="shortsStore.isLoading && shortsStore.shorts.length === 0" class="flex h-full items-center justify-center">
            <div class="text-center">
                <Loader />
                <p class="mt-4 text-gray-400">Fetching shorts from YouTube...</p>
            </div>
        </div>

        <div v-else-if="shortsStore.error" class="flex h-full items-center justify-center text-red-400">
            <div class="text-center p-6">
                <p class="text-lg font-bold">Error</p>
                <p class="mt-2 text-sm">{{ shortsStore.error }}</p>
                <button @click="loadShorts(true)" class="mt-4 bg-gray-800 px-4 py-2 rounded text-white">Try again</button>
            </div>
        </div>

        <div v-else-if="shortsStore.shorts.length === 0" class="flex h-full items-center justify-center text-gray-500">
            <div class="text-center p-6">
                <div class="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p>No shorts found here.</p>
                <button @click="loadShorts(true)" class="mt-4 text-blue-400">Try again</button>
            </div>
        </div>

        <template v-else>
            <div 
                v-for="(short, index) in shortsStore.shorts" 
                :key="short.youtube_video_id"
                :data-index="index"
                class="short-card h-full w-full snap-start relative"
            >
                <ShortCard 
                    :short="short" 
                    :is-active="index === activeShortIndex"
                />
            </div>
            
            <div v-if="shortsStore.isLoading && shortsStore.shorts.length > 0" class="h-20 flex items-center justify-center snap-end">
                <Loader />
            </div>
        </template>
    </div>
</template>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>
