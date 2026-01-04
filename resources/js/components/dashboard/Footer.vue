<template>
  <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 lg:px-6">
    <div class="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
      <!-- Copyright -->
      <div class="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
        {{ copyrightText }}
      </div>

      <!-- Links -->
      <div class="flex items-center space-x-4 text-sm">
        <a
          href="/privacy"
          class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          {{ $t('footer.privacy') }}
        </a>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <a
          href="/terms"
          class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          {{ $t('footer.terms') }}
        </a>
        <span class="text-gray-300 dark:text-gray-700">|</span>
        <a
          href="/support"
          class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          {{ $t('footer.support') }}
        </a>
      </div>

      <!-- Version -->
      <div class="text-sm text-gray-500 dark:text-gray-500">
        {{ versionText }}
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { APP } from '@/utils/constants';

/**
 * Footer Component
 * Simple footer with copyright, links, and version information
 * Features: Responsive layout, theme-aware styling
 */

const { t } = useI18n();

const currentYear = computed(() => new Date().getFullYear());
const copyrightText = computed(() => `© ${currentYear.value} ${APP.NAME}. ${t('footer.all_rights_reserved')}`);
const versionText = computed(() => `v${APP.VERSION}`);
</script>