import { defineStore } from 'pinia';
import api from '@/axios';

export const useShortsStore = defineStore('shorts', {
    state: () => ({
        shorts: [],
        isLoading: false,
        error: null,
        currentHashtag: null,
        currentChannelId: null,
        nextPageToken: null,
        isMuted: true,
    }),

    actions: {
        setMuted(muted) {
            this.isMuted = muted;
        },
        async fetchShorts(filters = {}, refresh = false) {
            const { hashtag, channelId } = filters;

            if (refresh) {
                this.shorts = [];
                this.nextPageToken = null;
            }

            // If filters changed, reset shorts list
            if (hashtag !== this.currentHashtag || channelId !== this.currentChannelId) {
                this.currentHashtag = hashtag;
                this.currentChannelId = channelId;
                this.shorts = [];
                this.nextPageToken = null;
            }

            if (this.isLoading) return;

            this.isLoading = true;
            this.error = null;

            try {
                const params = {};
                if (hashtag) params.hashtag = hashtag;
                if (channelId) params.channelId = channelId;
                if (this.nextPageToken) params.page_token = this.nextPageToken;

                const response = await api.get('/shorts', { params });

                if (refresh || this.shorts.length === 0) {
                    this.shorts = response.data.data;
                } else {
                    this.shorts = [...this.shorts, ...response.data.data];
                }

                this.nextPageToken = response.data.meta.next_page_token;
            } catch (err) {
                this.error = 'Failed to load shorts from YouTube';
            } finally {
                this.isLoading = false;
            }
        },

        async toggleFavorite(youtubeVideoId) {
            try {
                const response = await api.post(`/favorites/${youtubeVideoId}`);

                // Update local state
                const shortIndex = this.shorts.findIndex(s => s.youtube_video_id === youtubeVideoId);
                if (shortIndex !== -1) {
                    this.shorts[shortIndex].is_favorited = response.data.is_favorited;
                }

                return true;
            } catch (err) {
                console.error('Favorite toggle error', err);
                return false;
            }
        }
    }
});
