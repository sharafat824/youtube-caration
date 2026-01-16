import { defineStore } from 'pinia';
import api from '@/axios';

export const useHashtagsStore = defineStore('hashtags', {
    state: () => ({
        hashtags: [],
        isLoading: false,
        error: null,
        // Pagination & Filter State
        query: '',
        currentPage: 1,
        totalPages: 1,
        perPage: 10
    }),

    actions: {
        async fetchHashtags(refresh = false) {
            if (refresh) {
                this.currentPage = 1;
                this.hashtags = [];
            }

            this.isLoading = true;
            try {
                const params = {
                    page: this.currentPage,
                    limit: this.perPage,
                    search: this.query
                };

                const response = await api.get('/hashtags', { params });

                // If it's a fresh search or page 1 refresh, replace. 
                // Since this is admin table, we usually replace content for pagination logic.
                // Infinite scroll might want append, but table usually replaces.
                this.hashtags = response.data.data;
                this.totalPages = response.data.meta.total_pages;
                this.currentPage = parseInt(response.data.meta.current_page);

            } catch (err) {
                this.error = 'Failed to load hashtags';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },

        setSearch(query) {
            this.query = query;
            this.fetchHashtags(true);
        },

        setPage(page) {
            this.currentPage = page;
            this.fetchHashtags(false);
        },

        async createHashtag(hashtagData) {
            this.isLoading = true;
            try {
                await api.post('/admin/hashtags', hashtagData);
                await this.fetchHashtags(true); // Refresh list
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create hashtag';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async updateHashtag(id, hashtagData) {
            this.isLoading = true;
            try {
                await api.put(`/admin/hashtags/${id}`, hashtagData);
                await this.fetchHashtags(true); // Refresh list
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to update hashtag';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteHashtag(id) {
            try {
                await api.delete(`/admin/hashtags/${id}`);
                this.hashtags = this.hashtags.filter(h => h.id !== id);
                return true;
            } catch (err) {
                console.error('Delete error', err);
                return false;
            }
        }
    }
});
