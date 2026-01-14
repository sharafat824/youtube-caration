import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ShortsFeedView from '../views/ShortsFeedView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import FavoritesView from '../views/FavoritesView.vue'
import LoginView from '../views/LoginView.vue'
import AdminLayout from '@/components/layouts/AdminLayout.vue'
import AdminShortsView from '@/views/admin/AdminShortsView.vue'
import AdminCategoriesView from '@/views/admin/AdminCategoriesView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: ShortsFeedView
        },
        {
            path: '/categories',
            name: 'categories',
            component: CategoriesView
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
                    redirect: '/admin/shorts'
                },
                {
                    path: 'shorts',
                    name: 'admin-shorts',
                    component: AdminShortsView
                },
                {
                    path: 'categories',
                    name: 'admin-categories',
                    component: AdminCategoriesView
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
        next('/favorites') // Redirect to profile/favorites if already logged in
    } else {
        next()
    }
})

export default router
