<template>
  <div class="auth-background min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
    <!-- Naval Background with high intensity -->
    <NavalBackground intensity="high" />

    <div class="w-full max-w-md relative z-10">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4 shadow-2xl shadow-primary-500/50">
          <i class="fas fa-anchor text-white text-2xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-white drop-shadow-lg">{{ appName }}</h1>
        <p class="text-gray-300 mt-1 drop-shadow">{{ $t('auth.welcome_message') }}</p>
      </div>

      <!-- Main Content -->
      <router-view v-slot="{ Component }">
        <transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- Language Switcher -->
      <div class="mt-6 text-center">
        <LanguageSwitcher />
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center text-xs text-gray-400">
        <p>&copy; {{ currentYear }} {{ appName }}</p>
        <p class="mt-1 text-gray-500">Naval Repair Management System</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { APP } from '@/utils/constants';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import NavalBackground from '@/components/common/NavalBackground.vue';

const appName = computed(() => APP.NAME);
const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.auth-background {
  position: relative;
  background: transparent;
}
</style>
