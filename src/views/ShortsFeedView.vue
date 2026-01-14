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
                
                // Infinite scroll trigger when nearing end
                if (index >= shortsStore.shorts.length - 2 && shortsStore.hasMore && !shortsStore.isLoading) {
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

const loadMore = async () => {
    const category = route.query.category || null;
    await shortsStore.fetchShorts(category);
    // Re-attach observer for new items
    nextTick(() => {
        const cards = document.querySelectorAll('.short-card');
        cards.forEach((card) => observer.observe(card));
    });
};

// Watch for category changes in URL
watch(() => route.query.category, async (newCategory) => {
    activeShortIndex.value = 0;
    if(feedContainer.value) feedContainer.value.scrollTop = 0;
    await shortsStore.fetchShorts(newCategory, true); // true = refresh
    setupObserver();
});

onMounted(async () => {
    await shortsStore.fetchShorts(route.query.category);
    setupObserver();
});
</script>

<template>
    <div 
        ref="feedContainer" 
        class="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black pb-16 scroll-smooth no-scrollbar"
    >
        <div v-if="shortsStore.isLoading && shortsStore.shorts.length === 0" class="flex h-full items-center justify-center">
            <Loader />
        </div>

        <div v-else-if="shortsStore.shorts.length === 0" class="flex h-full items-center justify-center text-gray-500">
            No shorts found.
        </div>

        <template v-else>
            <div 
                v-for="(short, index) in shortsStore.shorts" 
                :key="short.id"
                :data-index="index"
                class="short-card h-full w-full snap-start relative"
            >
                <ShortCard 
                    :short="short" 
                    :is-active="index === activeShortIndex"
                />
            </div>
            
             <!-- Bottom Loader for Infinite Scroll -->
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
