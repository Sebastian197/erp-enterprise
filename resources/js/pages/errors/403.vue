<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div v-motion-slide-visible-once-bottom class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
        <i class="fas fa-ban text-5xl text-red-600 dark:text-red-400"></i>
      </div>
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{{ $t('errors.403.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md">{{ $t('errors.403.message') }}</p>
      <div class="flex items-center justify-center space-x-4">
        <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left">{{ $t('errors.go_back') }}</Button>
        <Button @click="async () => await router.push('/dashboard')" variant="primary" icon="fas fa-home">{{ $t('errors.go_home') }}</Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
</script>
