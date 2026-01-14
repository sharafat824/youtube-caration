import { defineStore } from 'pinia';
import api from '@/axios';

export const useShortsStore = defineStore('shorts', {
    state: () => ({
        shorts: [],
        nextCursor: null,
        isLoading: false,
        error: null,
        hasMore: true,
        currentCategory: null,
    }),

    actions: {
        async fetchShorts(categorySlug = null, refresh = false) {
            if (refresh) {
                this.shorts = [];
                this.nextCursor = null;
                this.hasMore = true;
            }

            // If category changed, reset
            if (categorySlug !== this.currentCategory) {
                this.currentCategory = categorySlug;
                this.shorts = [];
                this.nextCursor = null;
                this.hasMore = true;
            }

            if (!this.hasMore && !refresh) return;
            if (this.isLoading) return;

            this.isLoading = true;
            try {
                const params = {
                    cursor: this.nextCursor,
                };

                if (categorySlug) {
                    params.category = categorySlug;
                }

                const response = await api.get('/shorts', { params });

                const newShorts = response.data.data;
                const meta = response.data.meta;

                this.shorts = [...this.shorts, ...newShorts];
                this.nextCursor = meta.next_cursor;
                this.hasMore = !!this.nextCursor;
            } catch (err) {
                this.error = 'Failed to load shorts';
            } finally {
                this.isLoading = false;
            }
        },

        async toggleFavorite(shortId) {
            try {
                const response = await api.post(`/favorites/${shortId}`);

                // Update local state
                const shortIndex = this.shorts.findIndex(s => s.id === shortId);
                if (shortIndex !== -1) {
                    this.shorts[shortIndex].is_favorited = response.data.is_favorited;
                }

                return true;
            } catch (err) {
                console.error('Favorite toggle error', err);
                return false;
            }
        },

        async createShort(shortData) {
            this.isLoading = true;
            try {
                await api.post('/admin/shorts', shortData);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create short';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteShort(shortId) {
            try {
                await api.delete(`/admin/shorts/${shortId}`);
                this.shorts = this.shorts.filter(s => s.id !== shortId);
                return true;
            } catch (err) {
                console.error('Delete error', err);
                return false;
            }
        }
    }
});
