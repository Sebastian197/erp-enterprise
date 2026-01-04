<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
    <!-- Language Switcher -->
    <div class="absolute top-4 right-4 z-10">
      <LanguageSwitcher />
    </div>

    <!-- Auth Container -->
    <div
      v-motion-slide-visible-once-bottom
      class="w-full max-w-md"
    >
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl shadow-lg mb-4">
          <i class="fas fa-building text-3xl text-white"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ appName }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">
          {{ $t('auth.welcome_message') }}
        </p>
      </div>

      <!-- Content Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
        <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p>{{ appVersion }} &copy; {{ currentYear }} {{ appName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { APP } from '@/utils/constants';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

/**
 * AuthLayout Component
 * Simple centered layout for authentication pages (login, register, forgot password)
 * Features: Logo display, language switcher, responsive design, animated entrance
 */

const appName = computed(() => APP.NAME);
const appVersion = computed(() => `v${APP.VERSION}`);
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
/* Custom scrollbar for dark mode */
:deep(.dark) {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

:deep(.dark::-webkit-scrollbar) {
  width: 6px;
}

:deep(.dark::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.dark::-webkit-scrollbar-thumb) {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}
</style>
