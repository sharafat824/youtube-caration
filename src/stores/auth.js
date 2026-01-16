import { defineStore } from 'pinia';
import api from '@/axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isLoading: false,
        error: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
        isAdmin: (state) => state.user?.role === 'admin',
    },

    actions: {
        async register(userData) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await api.post('/register', userData);

                // response.data is the full Axios response body
                // response.data.data contains { id, name, email, role, token }
                const { token, ...userDetails } = response.data.data;

                this.token = token;
                this.user = userDetails;

                localStorage.setItem('token', this.token);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Registration failed';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async login(credentials) {
            this.isLoading = true;
            this.error = null;
            try {
                const response = await api.post('/login', credentials);

                const { token, ...userDetails } = response.data.data;

                this.token = token;
                this.user = userDetails;

                localStorage.setItem('token', this.token);
                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Login failed';
                return false;
            } finally {
                this.isLoading = false;
            }
        },

        async logout() {
            // In JWT stateless auth, logout is primarily local
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');

            // Optional: call backend if we had a token blacklist, 
            // but for simple setup, clearing local state is enough.
        },

        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await api.get('/user');
                this.user = response.data.data;
            } catch (err) {
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
            }
        }
    }
});
