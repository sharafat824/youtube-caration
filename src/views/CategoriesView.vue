<script setup>
import { onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import { RouterLink } from 'vue-router';
import Loader from '@/components/ui/Loader.vue';

const categoriesStore = useCategoriesStore();

onMounted(() => {
    categoriesStore.fetchCategories();
});
</script>

<template>
    <div class="min-h-screen pt-4 px-4 pb-20 bg-black">
        <h1 class="text-2xl font-bold mb-6">Discover</h1>

        <div v-if="categoriesStore.isLoading" class="flex justify-center mt-10">
            <Loader />
        </div>

        <div v-else class="grid grid-cols-2 gap-4">
            <RouterLink 
                v-for="cat in categoriesStore.categories" 
                :key="cat.id"
                :to="{ path: '/', query: { category: cat.slug } }"
                class="aspect-video bg-gray-800 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-gray-700 transition-colors group"
            >
                <!-- Icon Placeholder -->
                <div class="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center mb-2 text-2xl">
                    #
                </div>
                <span class="font-semibold text-lg">{{ cat.name }}</span>
                <span class="text-xs text-gray-400">{{ cat.shorts_count }} videos</span>
            </RouterLink>
        </div>
    </div>
</template>
