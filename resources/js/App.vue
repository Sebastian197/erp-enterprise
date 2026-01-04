<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useThemeStore } from '@/stores/theme';
import { useAuthStore } from '@/stores/auth';
import { useLocaleStore } from '@/stores/locale';
import { useWebSocket } from '@/composables/useWebSocket';

const themeStore = useThemeStore();
const authStore = useAuthStore();
const localeStore = useLocaleStore();
const { connect, disconnect, notifications: listenToNotifications } = useWebSocket();

/**
 * Initialize application on mount
 */
onMounted(() => {
  // Apply stored theme
  themeStore.applyTheme(themeStore.currentTheme);

  // Apply stored locale
  localeStore.applyLocale(localeStore.currentLocale);

  // Fetch user if authenticated
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchUser().catch(err => {
      console.error('Failed to fetch user:', err);
    });
  }

  // Connect to WebSocket if authenticated
  if (authStore.isAuthenticated) {
    connect();
    listenToNotifications();
  }
});

/**
 * Watch authentication state and manage WebSocket connection
 */
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      connect();
      listenToNotifications();
    } else {
      disconnect();
    }
  }
);
</script>

<style>
@import '@/styles/main.css';
@import '@/styles/components/adminlte.css';
@import '@fortawesome/fontawesome-free/css/all.min.css';
</style>