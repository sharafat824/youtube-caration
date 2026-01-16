<script setup>
import { ref, onMounted } from 'vue';
import { useHashtagsStore } from '@/stores/hashtags';
import Loader from '@/components/ui/Loader.vue';

const hashtagsStore = useHashtagsStore();

const activeTab = ref('list'); // 'list' or 'create'
const searchQuery = ref('');
let searchTimeout = null;

const isEditing = ref(false);
const editId = ref(null);
const formData = ref({
    name: '',
    status: 'active'
});

const handleSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        hashtagsStore.setSearch(searchQuery.value);
    }, 300);
};

const resetForm = () => {
    isEditing.value = false;
    editId.value = null;
    formData.value = { name: '', status: 'active' };
};

const handleEdit = (hashtag) => {
    isEditing.value = true;
    editId.value = hashtag.id;
    formData.value = { 
        name: hashtag.name, 
        status: hashtag.status 
    };
    
    // Switch to create tab on mobile
    activeTab.value = 'create';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleSubmit = async () => {
    let success = false;
    
    // Ensure name is clean (no spaces, for hashtags)
    formData.value.name = formData.value.name.replace(/\s+/g, '').replace(/#/g, '');

    if (isEditing.value && editId.value) {
        success = await hashtagsStore.updateHashtag(editId.value, formData.value);
    } else {
        success = await hashtagsStore.createHashtag(formData.value);
    }

    if (success) {
        resetForm();
    }
};

const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this hashtag?')) {
        await hashtagsStore.deleteHashtag(id);
    }
};

onMounted(() => {
    hashtagsStore.fetchHashtags();
});
</script>

<template>
    <div class="animate-in fade-in duration-500">
        <header class="mb-8 md:mb-10">
            <h1 class="text-2xl md:text-3xl font-black text-white tracking-tight">Hashtags</h1>
            <p class="text-sm md:text-base text-gray-500 mt-1">Manage trending topics for the discovery feed.</p>
        </header>

        <!-- Mobile Tabs -->
        <div class="md:hidden flex space-x-1 bg-white/5 p-1 rounded-xl mb-6">
            <button 
                @click="activeTab = 'list'" 
                class="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                :class="activeTab === 'list' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'"
            >
                View List
            </button>
            <button 
                @click="activeTab = 'create'" 
                class="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                :class="activeTab === 'create' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'"
            >
                {{ isEditing ? 'Edit Topic' : 'Add New' }}
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            <!-- Form Card (Desktop: Always Visible, Mobile: Show only if tab='create') -->
            <div 
                v-show="activeTab === 'create' || $route.name /* Trick to keep desktop visible relies on grid - but simply using v-show with media query logic in script is cleaner or just css hidden */ "
                class="lg:col-span-4 lg:block"
                :class="{ 'hidden': activeTab !== 'create' /* Only applies on mobile if we default block desktop via css, but Vue class logic is easier */ }"
            >
                <!-- Desktop Sidebar Sticky, Mobile Static -->
                 <div class="glass-card p-6 md:p-8 sticky top-24">
                    <h2 class="text-xl font-bold mb-6 text-white flex items-center">
                        <span v-if="isEditing" class="text-blue-400 mr-2">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </span>
                        <span v-else class="text-green-400 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </span>
                        {{ isEditing ? 'Edit Topic' : 'New Topic' }}
                    </h2>
                    
                    <form @submit.prevent="handleSubmit" class="space-y-5">
                        <div>
                            <label class="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Hashtag Name</label>
                            <div class="relative group">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold group-focus-within:text-white transition-colors">#</span>
                                <input 
                                    v-model="formData.name" 
                                    type="text" 
                                    class="premium-input pl-8" 
                                    placeholder="trending"
                                    required 
                                />
                            </div>
                            <p class="text-[10px] text-gray-600 mt-2 font-medium">Spaces will be removed automatically.</p>
                        </div>

                        <div>
                            <label class="block text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">Visibility Status</label>
                            <select v-model="formData.status" class="premium-input appearance-none">
                                <option value="active">Active (Visible)</option>
                                <option value="inactive">Inactive (Hidden)</option>
                            </select>
                        </div>

                        <div class="flex flex-col space-y-3 pt-2">
                             <button type="submit" class="premium-btn-primary py-3" :disabled="hashtagsStore.isLoading">
                                <span v-if="!hashtagsStore.isLoading">{{ isEditing ? 'Update Hashtag' : 'Create Hashtag' }}</span>
                                <Loader v-else class="w-5 h-5 border-2 mx-auto" />
                            </button>
                            <button v-if="isEditing" type="button" @click="resetForm" class="text-xs text-gray-500 hover:text-white transition-colors py-2">
                                Cancel Edit
                            </button>
                        </div>
                         <div v-if="hashtagsStore.error" class="text-red-400 text-[10px] font-bold uppercase text-center mt-2">
                            {{ hashtagsStore.error }}
                        </div>
                    </form>
                </div>
            </div>

            <!-- List (Desktop: Always Visible, Mobile: Show only if tab='list') -->
            <div 
                v-show="activeTab === 'list'"
                class="lg:col-span-8 lg:block"
            >
                 <div class="glass-card overflow-hidden">
                    <!-- Search Bar -->
                    <div class="p-4 border-b border-white/5 flex items-center">
                         <div class="relative w-full max-w-md">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input 
                                v-model="searchQuery" 
                                @input="handleSearch"
                                type="text" 
                                class="w-full bg-[#12141a] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-white/10 placeholder:text-gray-600"
                                placeholder="Search hashtags..."
                            >
                        </div>
                    </div>

                    <!-- Desktop Table -->
                    <div class="hidden md:block overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="border-b border-white/5 bg-white/[0.02]">
                                    <th class="p-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Topic</th>
                                    <th class="p-5 text-[10px] uppercase font-black tracking-widest text-gray-500">Status</th>
                                    <th class="p-5 text-right text-[10px] uppercase font-black tracking-widest text-gray-500">Management</th>
                                </tr>
                            </thead>
                             <tbody class="divide-y divide-white/5">
                                <tr v-if="hashtagsStore.isLoading && hashtagsStore.hashtags.length === 0" class="text-center">
                                    <td colspan="3" class="p-20"><Loader /></td>
                                </tr>
                                 <tr v-else-if="hashtagsStore.hashtags.length === 0" class="text-center">
                                    <td colspan="3" class="p-20 text-gray-500 font-medium">No topics found.</td>
                                </tr>
                                <tr v-for="tag in hashtagsStore.hashtags" :key="tag.id" class="hover:bg-white/[0.01] transition-colors group">
                                    <td class="p-5">
                                        <div class="flex items-center">
                                            <div class="w-2 h-2 rounded-full bg-red-500 mr-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                            <span class="font-bold text-gray-200 group-hover:text-white transition-colors">#{{ tag.name }}</span>
                                        </div>
                                    </td>
                                    <td class="p-5">
                                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter" :class="tag.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'">
                                            {{ tag.status }}
                                        </span>
                                    </td>
                                    <td class="p-5 text-right space-x-4">
                                        <button @click="handleEdit(tag)" class="text-[10px] font-black uppercase text-gray-500 hover:text-blue-400 transition-colors tracking-widest">Edit</button>
                                        <div class="inline-block w-px h-3 bg-gray-800 align-middle"></div>
                                        <button @click="handleDelete(tag.id)" class="text-[10px] font-black uppercase text-gray-500 hover:text-red-500 transition-colors tracking-widest">Delete</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Mobile Grid -->
                    <div class="md:hidden p-4 space-y-3">
                         <div v-if="hashtagsStore.isLoading && hashtagsStore.hashtags.length === 0" class="flex justify-center p-10">
                            <Loader />
                        </div>
                        <div v-else-if="hashtagsStore.hashtags.length === 0" class="text-center p-10 text-gray-500 text-sm">
                            No topics found.
                        </div>
                        <div 
                            v-for="tag in hashtagsStore.hashtags" 
                            :key="tag.id"
                            class="bg-[#12141a] rounded-xl p-4 border border-white/5 flex items-center justify-between"
                        >
                            <div class="flex items-center min-w-0">
                                <div class="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mr-3 shrink-0">
                                    <span class="text-xs font-bold">#</span>
                                </div>
                                <div class="truncate">
                                    <p class="font-bold text-gray-200 text-sm truncate">{{ tag.name }}</p>
                                    <div class="flex items-center mt-1">
                                        <span class="w-1.5 h-1.5 rounded-full mr-2" :class="tag.status === 'active' ? 'bg-green-500' : 'bg-red-500'"></span>
                                        <span class="text-[10px] uppercase font-bold text-gray-500">{{ tag.status }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center space-x-2 shrink-0 ml-4">
                                <button @click="handleEdit(tag)" class="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button @click="handleDelete(tag.id)" class="p-2 bg-red-500/5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                     <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination Controls -->
                    <div class="p-4 border-t border-white/5 flex items-center justify-between" v-if="hashtagsStore.totalPages > 1">
                        <button 
                            @click="hashtagsStore.setPage(hashtagsStore.currentPage - 1)"
                            :disabled="hashtagsStore.currentPage <= 1"
                            class="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 bg-white/5 rounded-lg"
                        >
                            Previous
                        </button>
                        <span class="text-xs font-bold text-gray-400">Page {{ hashtagsStore.currentPage }} of {{ hashtagsStore.totalPages }}</span>
                         <button 
                            @click="hashtagsStore.setPage(hashtagsStore.currentPage + 1)"
                            :disabled="hashtagsStore.currentPage >= hashtagsStore.totalPages"
                            class="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1 bg-white/5 rounded-lg"
                        >
                            Next
                        </button>
                    </div>

                 </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.glass-card {
    @apply bg-[#0a0c10] border border-white/5 rounded-2xl shadow-2xl;
}

.premium-input {
    @apply w-full bg-[#12141a] rounded-xl p-4 border border-white/5 text-gray-200 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all placeholder:text-gray-700 text-sm;
}

.premium-btn-primary {
    @apply bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 hover:to-orange-400 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-lg active:scale-[0.98];
}
</style>
