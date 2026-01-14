import { defineStore } from 'pinia';
import api from '@/axios';

export const useCategoriesStore = defineStore('categories', {
    state: () => ({
        categories: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchCategories(refresh = false) {
            // Return cached if available and not refreshing
            if (this.categories.length > 0 && !refresh) return;

            this.isLoading = true;
            try {
                const response = await api.get('/categories');
                this.categories = response.data.data;
            } catch (err) {
                this.error = 'Failed to load categories';
            } finally {
                this.isLoading = false;
            }
        },

        async createCategory(categoryData) {
            this.isLoading = true;
            try {
                await api.post('/admin/categories', categoryData);
                await this.fetchCategories(true); // Refresh list
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create category';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async updateCategory(id, categoryData) {
            this.isLoading = true;
            try {
                await api.put(`/admin/categories/${id}`, categoryData);
                await this.fetchCategories(true); // Refresh list
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to update category';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteCategory(id) {
            try {
                await api.delete(`/admin/categories/${id}`);
                this.categories = this.categories.filter(c => c.id !== id);
                return true;
            } catch (err) {
                console.error('Delete error', err);
                return false;
            }
        }
    }
});
