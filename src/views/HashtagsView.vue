<script setup>
import { onMounted } from 'vue';
import { useHashtagsStore } from '@/stores/hashtags';
import { useChannelsStore } from '@/stores/channels';
import Loader from '@/components/ui/Loader.vue';

const hashtagsStore = useHashtagsStore();
const channelsStore = useChannelsStore();

onMounted(() => {
    hashtagsStore.fetchHashtags();
    channelsStore.fetchChannels();
});
</script>

<template>
    <div class="min-h-screen bg-black pb-24">
        <div class="p-6 border-b border-gray-800">
            <h1 class="text-2xl font-bold text-white">Discover</h1>
            <p class="text-gray-400 text-sm mt-1">Explore shorts by trending hashtags or curated channels.</p>
        </div>

        <!-- Section: Hashtags -->
        <div class="p-6">
            <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Hashtags</h2>
            <div v-if="hashtagsStore.isLoading && hashtagsStore.hashtags.length === 0" class="py-4">
                <Loader />
            </div>
            <div v-else class="flex flex-wrap gap-2">
                <router-link 
                    v-for="tag in hashtagsStore.hashtags" 
                    :key="tag.id"
                    :to="{ path: '/', query: { hashtag: tag.name } }"
                    class="px-4 py-2 bg-gray-900 border border-gray-800 rounded-full text-white hover:bg-white hover:text-black transition-colors"
                >
                    #{{ tag.name }}
                </router-link>
            </div>
        </div>

        <!-- Section: Curated Channels -->
        <div class="p-6 border-t border-gray-900">
            <h2 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Curated Channels</h2>
            <div v-if="channelsStore.isLoading && channelsStore.channels.length === 0" class="py-4">
                <Loader />
            </div>
            <div v-else class="grid grid-cols-1 gap-3">
                <router-link 
                    v-for="channel in channelsStore.channels" 
                    :key="channel.id"
                    :to="{ path: '/', query: { channelId: channel.channel_id } }"
                    class="flex items-center p-4 bg-gray-900/50 border border-gray-800 rounded-xl hover:bg-gray-800 transition-colors group"
                >
                    <div class="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500 mr-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                        </svg>
                    </div>
                    <div>
                        <p class="text-white font-bold">{{ channel.name }}</p>
                        <p class="text-gray-500 text-xs mt-0.5">Watch all shorts from this channel</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>
