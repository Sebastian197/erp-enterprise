<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div v-motion-slide-visible-once-bottom class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-6">
        <i class="fas fa-server text-5xl text-yellow-600 dark:text-yellow-400"></i>
      </div>
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">500</h1>
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">{{ $t('errors.500.title') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md">{{ $t('errors.500.message') }}</p>
      <div class="flex items-center justify-center space-x-4">
        <Button @click="retry" variant="primary" icon="fas fa-redo">{{ $t('errors.try_again') }}</Button>
        <Button @click="router.push('/dashboard')" variant="ghost" icon="fas fa-home">{{ $t('errors.go_home') }}</Button>
      </div>
      <div class="mt-6">
        <a href="/support" class="text-sm text-primary hover:text-primary-dark transition-colors">{{ $t('errors.contact_support') }}</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/ui/Button.vue';

const router = useRouter();

const retry = () => {
  window.location.reload();
};
</script>
