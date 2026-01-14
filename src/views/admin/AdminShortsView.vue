<script setup>
import { ref, onMounted } from 'vue';
import { useShortsStore } from '@/stores/shorts';
import { useCategoriesStore } from '@/stores/categories';
import Loader from '@/components/ui/Loader.vue';

const shortsStore = useShortsStore();
const categoriesStore = useCategoriesStore();

const isCreating = ref(false);
const newShort = ref({
    title: '',
    youtube_video_id: '',
    youtube_channel_name: '',
    duration_seconds: 60,
    category_id: '',
    thumbnail_url: '' // Helper to auto-generate from ID
});

const extractVideoId = (input) => {
    // Handle full URL input
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = input.match(regExp);
    return (match && match[2].length === 11) ? match[2] : input;
};

const handleVideoIdInput = () => {
    const rawParams = newShort.value.youtube_video_id;
    newShort.value.youtube_video_id = extractVideoId(rawParams);
    generateThumbnail();
};

const generateThumbnail = () => {
    if (newShort.value.youtube_video_id && newShort.value.youtube_video_id.length === 11 && !newShort.value.thumbnail_url) {
        newShort.value.thumbnail_url = `https://img.youtube.com/vi/${newShort.value.youtube_video_id}/maxresdefault.jpg`;
    }
};

const handleCreate = async () => {
    if (!newShort.value.category_id) {
        alert('Please select a category');
        return;
    }
    
    // Final generic/fallback check
    const id = extractVideoId(newShort.value.youtube_video_id);
    newShort.value.youtube_video_id = id;
    
    if (id.length !== 11) {
        alert('Invalid YouTube Video ID');
        return;
    }

    generateThumbnail();
    
    // Auto specific orientation
    const payload = { ...newShort.value, orientation: 'vertical' };
    
    const success = await shortsStore.createShort(payload);
    if (success) {
        isCreating.value = false;
        // Reset form
        newShort.value = { title: '', youtube_video_id: '', youtube_channel_name: '', duration_seconds: 60, category_id: '', thumbnail_url: '' };
        // Refresh list
        await shortsStore.fetchShorts(null, true);
    }
};

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this short?')) {
        await shortsStore.deleteShort(id);
    }
};

onMounted(() => {
    shortsStore.fetchShorts(null, true);
    categoriesStore.fetchCategories();
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Shorts Manager</h1>
            <button 
                @click="isCreating = !isCreating"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
                {{ isCreating ? 'Cancel' : 'Add New Short' }}
            </button>
        </div>

        <!-- Create Form -->
        <div v-if="isCreating" class="bg-gray-800 p-6 rounded-lg mb-8">
            <h2 class="text-xl font-semibold mb-4">Post New Short</h2>
            <form @submit.prevent="handleCreate" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                    <label class="block text-sm mb-1">YouTube Video URL or ID</label>
                    <input v-model="newShort.youtube_video_id" @change="handleVideoIdInput" type="text" class="w-full bg-gray-700 rounded p-2 border border-gray-600" placeholder="Paste full URL or ID" required />
                    <p class="text-xs text-gray-400 mt-1">Found ID: {{ newShort.youtube_video_id }}</p>
                </div>

                <div>
                    <label class="block text-sm mb-1">Title</label>
                    <input v-model="newShort.title" type="text" class="w-full bg-gray-700 rounded p-2 border border-gray-600" required />
                </div>

                <div>
                    <label class="block text-sm mb-1">Channel Name</label>
                    <input v-model="newShort.youtube_channel_name" type="text" class="w-full bg-gray-700 rounded p-2 border border-gray-600" required />
                </div>

                <div>
                    <label class="block text-sm mb-1">Category</label>
                    <select v-model="newShort.category_id" class="w-full bg-gray-700 rounded p-2 border border-gray-600" required>
                        <option value="" disabled>Select Category</option>
                        <option v-for="cat in categoriesStore.categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                 <div>
                    <label class="block text-sm mb-1">Thumbnail URL</label>
                    <input v-model="newShort.thumbnail_url" type="url" class="w-full bg-gray-700 rounded p-2 border border-gray-600" placeholder="https://..." required />
                </div>

                <div>
                    <label class="block text-sm mb-1">Duration (Sec)</label>
                    <input v-model="newShort.duration_seconds" type="number" max="60" class="w-full bg-gray-700 rounded p-2 border border-gray-600" required />
                </div>

                <div class="md:col-span-2 flex justify-end mt-4">
                    <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold">
                        Save Short
                    </button>
                </div>
            </form>
        </div>

        <!-- List -->
        <div class="bg-gray-800 rounded-lg overflow-hidden">
            <table class="w-full text-left">
                <thead class="bg-gray-700">
                    <tr>
                        <th class="p-4">Thumbnail</th>
                        <th class="p-4">Title</th>
                        <th class="p-4">Category</th>
                        <th class="p-4">Views</th>
                        <th class="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                    <tr v-if="shortsStore.isLoading" class="text-center">
                        <td colspan="5" class="p-8"><Loader /></td>
                    </tr>
                    <tr v-for="short in shortsStore.shorts" :key="short.id" class="hover:bg-gray-700/50">
                        <td class="p-4">
                            <img :src="short.thumbnail_url" class="w-16 h-24 object-cover rounded bg-gray-900" />
                        </td>
                        <td class="p-4">
                            <div class="font-medium">{{ short.title }}</div>
                            <div class="text-sm text-gray-400">{{ short.youtube_channel_name }}</div>
                        </td>
                        <td class="p-4">
                            <span v-if="short.category" class="px-2 py-1 bg-gray-600 rounded text-xs">{{ short.category.name }}</span>
                        </td>
                        <td class="p-4">{{ short.views }}</td>
                        <td class="p-4">
                            <button @click="handleDelete(short.id)" class="text-red-400 hover:text-red-300 hover:underline">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
