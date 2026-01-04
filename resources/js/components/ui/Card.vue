<template>
  <div
    :class="[
      'bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200',
      hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
    ]"
  >
    <!-- Card Header -->
    <div
      v-if="title || subtitle || $slots.header || collapsible"
      class="px-6 py-4 border-b border-gray-200 dark:border-gray-700"
    >
      <div class="flex items-center justify-between">
        <!-- Header Content -->
        <div class="flex-1">
          <slot name="header">
            <h3 v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <!-- Collapse Toggle -->
        <button
          v-if="collapsible"
          @click="toggleCollapse"
          class="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          :aria-label="isCollapsed ? $t('card.expand') : $t('card.collapse')"
        >
          <i
            :class="[
              'fas fa-chevron-down transition-transform duration-200',
              isCollapsed && '-rotate-180',
            ]"
          ></i>
        </button>
      </div>
    </div>

    <!-- Card Body -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="!isCollapsed" class="px-6 py-4">
        <!-- Loading State -->
        <div v-if="loading" class="space-y-3">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
        </div>

        <!-- Content -->
        <div v-else>
          <slot></slot>
        </div>
      </div>
    </transition>

    <!-- Card Footer -->
    <div
      v-if="$slots.footer && !isCollapsed"
      class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
    >
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

/**
 * Card Component
 * Reusable card container with header, body, and footer
 * Features: Collapsible, loading state, hover effects, customizable slots
 */

defineProps({
  title: {
    type: String,
    default: null,
  },
  subtitle: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  hoverable: {
    type: Boolean,
    default: false,
  },
});

const isCollapsed = ref(false);

/**
 * Toggle collapse state
 */
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>
