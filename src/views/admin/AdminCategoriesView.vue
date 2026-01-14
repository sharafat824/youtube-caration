<script setup>
import { ref, onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories';
import Loader from '@/components/ui/Loader.vue';

const categoriesStore = useCategoriesStore();

const isEditing = ref(false);
const editId = ref(null);
const formData = ref({
    name: '',
    slug: '',
    status: 'active'
});

const resetForm = () => {
    isEditing.value = false;
    editId.value = null;
    formData.value = { name: '', slug: '', status: 'active' };
};

const handleEdit = (category) => {
    isEditing.value = true;
    editId.value = category.id;
    formData.value = { ...category };
};

const handleSubmit = async () => {
    let success = false;
    if (isEditing.value && editId.value) {
        success = await categoriesStore.updateCategory(editId.value, formData.value);
    } else {
        success = await categoriesStore.createCategory(formData.value);
    }

    if (success) {
        resetForm();
    }
};

const handleDelete = async (id) => {
    if (confirm('Are you sure? This may affect shorts in this category.')) {
        await categoriesStore.deleteCategory(id);
    }
};

// Auto-slug generation
const generateSlug = () => {
    if (!isEditing.value || !formData.value.slug) {
        formData.value.slug = formData.value.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    }
};

onMounted(() => {
    categoriesStore.fetchCategories();
});
</script>

<template>
    <div>
        <h1 class="text-2xl font-bold mb-6">Categories Manager</h1>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <!-- Form Card -->
            <div class="md:col-span-1">
                <div class="bg-gray-800 p-6 rounded-lg sticky top-6">
                    <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Edit Category' : 'New Category' }}</h2>
                    
                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div>
                            <label class="block text-sm mb-1">Name</label>
                            <input v-model="formData.name" @input="generateSlug" type="text" class="w-full bg-gray-700 rounded p-2 border border-gray-600" required />
                        </div>

                        <div>
                            <label class="block text-sm mb-1">Slug</label>
                            <input v-model="formData.slug" type="text" class="w-full bg-gray-700 rounded p-2 border border-gray-600" required />
                        </div>

                        <div>
                            <label class="block text-sm mb-1">Status</label>
                            <select v-model="formData.status" class="w-full bg-gray-700 rounded p-2 border border-gray-600">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div class="flex space-x-2">
                             <button type="submit" class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50" :disabled="categoriesStore.isLoading">
                                {{ isEditing ? 'Update' : 'Create' }}
                            </button>
                            <button v-if="isEditing" type="button" @click="resetForm" class="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded">
                                Cancel
                            </button>
                        </div>
                         <div v-if="categoriesStore.error" class="text-red-400 text-sm mt-2">
                            {{ categoriesStore.error }}
                        </div>
                    </form>
                </div>
            </div>

            <!-- List -->
            <div class="md:col-span-2">
                 <div class="bg-gray-800 rounded-lg overflow-hidden">
                    <table class="w-full text-left">
                        <thead class="bg-gray-700">
                            <tr>
                                <th class="p-4">Name</th>
                                <th class="p-4">Slug</th>
                                <th class="p-4">Status</th>
                                <th class="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                         <tbody class="divide-y divide-gray-700">
                            <tr v-if="categoriesStore.isLoading && categoriesStore.categories.length === 0" class="text-center">
                                <td colspan="4" class="p-8"><Loader /></td>
                            </tr>
                             <tr v-else-if="categoriesStore.categories.length === 0" class="text-center">
                                <td colspan="4" class="p-8 text-gray-500">No categories found.</td>
                            </tr>
                            <tr v-for="cat in categoriesStore.categories" :key="cat.id" class="hover:bg-gray-700/50">
                                <td class="p-4 font-medium">{{ cat.name }}</td>
                                <td class="p-4 text-gray-400 text-sm">{{ cat.slug }}</td>
                                <td class="p-4">
                                    <span class="px-2 py-1 rounded text-xs" :class="cat.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'">
                                        {{ cat.status }}
                                    </span>
                                </td>
                                <td class="p-4 text-right space-x-2">
                                    <button @click="handleEdit(cat)" class="text-blue-400 hover:underline">Edit</button>
                                    <button @click="handleDelete(cat.id)" class="text-red-400 hover:underline">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    </div>
</template>
