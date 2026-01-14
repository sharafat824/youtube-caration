import { defineStore } from 'pinia';
import api from '@/axios';
import axios from 'axios';

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
                await axios.get('/sanctum/csrf-cookie');
                const response = await api.post('/register', userData);

                this.token = response.data.token;
                this.user = response.data.user;

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
                await axios.get('/sanctum/csrf-cookie');
                const response = await api.post('/login', credentials);

                this.token = response.data.token;
                this.user = response.data.user;

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
            try {
                await api.post('/logout');
            } catch (err) {
                console.error('Logout error', err);
            } finally {
                this.token = null;
                this.user = null;
                localStorage.removeItem('token');
            }
        },

        async fetchUser() {
            if (!this.token) return;
            try {
                const response = await api.get('/user');
                this.user = response.data.user;
            } catch (err) {
                this.token = null;
                localStorage.removeItem('token');
            }
        }
    }
});
