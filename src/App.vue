<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/ui/NavBar.vue'
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
    // Attempt to restore session on load
    authStore.fetchUser()
})
</script>

<template>
  <div class="bg-black min-h-screen text-white font-sans antialiased overflow-hidden">
    <RouterView />
    <NavBar />
  </div>
</template>
