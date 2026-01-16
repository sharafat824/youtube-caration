import { defineStore } from 'pinia';
import api from '@/axios';
import { useAuthStore } from './auth';

export const useSubscriptionStore = defineStore('subscriptions', {
    state: () => ({
        subscriptions: [], // Array of channel_id strings
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchSubscriptions() {
            const authStore = useAuthStore();
            if (!authStore.isAuthenticated) return;

            this.isLoading = true;
            try {
                const response = await api.get('/subscriptions');
                if (response.data.status === 'success') {
                    this.subscriptions = response.data.data;
                }
            } catch (error) {
                console.error('Fetch Subscriptions Error:', error);
                this.error = error.response?.data?.message || 'Failed to fetch subscriptions';
            } finally {
                this.isLoading = false;
            }
        },

        async toggleSubscription(channelId) {
            const authStore = useAuthStore();
            if (!authStore.isAuthenticated) return false;

            try {
                const response = await api.post(`/subscriptions/toggle/${channelId}`);
                if (response.data.status === 'success') {
                    const isSubscribed = response.data.is_subscribed;
                    if (isSubscribed) {
                        this.subscriptions.push(channelId);
                    } else {
                        this.subscriptions = this.subscriptions.filter(id => id !== channelId);
                    }
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Toggle Subscription Error:', error);
                this.error = error.response?.data?.message || 'Failed to update subscription';
                return false;
            }
        },

        isSubscribed(channelId) {
            return this.subscriptions.includes(channelId);
        }
    }
});
