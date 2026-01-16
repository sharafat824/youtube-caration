import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ShortsFeedView from '../views/ShortsFeedView.vue'
import HashtagsView from '../views/HashtagsView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import AdminHashtagsView from '@/views/admin/AdminHashtagsView.vue'
import AdminChannelsView from '@/views/admin/AdminChannelsView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: ShortsFeedView
        },
        {
            path: '/discover',
            name: 'discover',
            component: HashtagsView
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: FavoritesView,
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: { guestOnly: true }
        },
        {
            path: '/admin',
            component: AdminLayout,
            meta: { requiresAuth: true, requiresAdmin: true },
            children: [
                {
                    path: '',
                    redirect: '/admin/hashtags'
                },
                {
                    path: 'hashtags',
                    name: 'admin-hashtags',
                    component: AdminHashtagsView
                },
                {
                    path: 'channels',
                    name: 'admin-channels',
                    component: AdminChannelsView
                }
            ]
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Ensure user is loaded (or attempted)
    if (!authStore.user && authStore.token) {
        await authStore.fetchUser()
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
        next('/')
    } else if (to.meta.guestOnly && authStore.isAuthenticated) {
        next('/favorites')
    } else {
        next()
    }
})

export default router
