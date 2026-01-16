import { defineStore } from 'pinia';
import api from '@/axios';

export const useChannelsStore = defineStore('channels', {
    state: () => ({
        channels: [],
        isLoading: false,
        error: null,
        query: '',
        currentPage: 1,
        totalPages: 1,
        perPage: 10
    }),

    actions: {
        async fetchChannels(refresh = false) {
            if (refresh) {
                this.currentPage = 1;
                this.channels = [];
            }

            this.isLoading = true;
            try {
                const params = {
                    page: this.currentPage,
                    limit: this.perPage,
                    search: this.query
                };

                const response = await api.get('/channels', { params });
                this.channels = response.data.data;
                this.totalPages = response.data.meta.total_pages;
                this.currentPage = parseInt(response.data.meta.current_page);
            } catch (err) {
                this.error = 'Failed to load channels';
                console.error(err);
            } finally {
                this.isLoading = false;
            }
        },

        setSearch(query) {
            this.query = query;
            this.fetchChannels(true);
        },

        setPage(page) {
            this.currentPage = page;
            this.fetchChannels(false);
        },

        async createChannel(channelData) {
            this.isLoading = true;
            try {
                await api.post('/admin/channels', channelData);
                await this.fetchChannels(true);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to create channel';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async updateChannel(id, channelData) {
            this.isLoading = true;
            try {
                await api.put(`/admin/channels/${id}`, channelData);
                await this.fetchChannels(true);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Failed to update channel';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async deleteChannel(id) {
            try {
                await api.delete(`/admin/channels/${id}`);
                this.channels = this.channels.filter(c => c.id !== id);
                return true;
            } catch (err) {
                console.error('Delete error', err);
                return false;
            }
        }
    }
});
