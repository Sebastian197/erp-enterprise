<template>
  <div
    :class="[
      'bg-card rounded-lg shadow-card border-card transition-all duration-200',
      hoverable && 'hover:shadow-lg hover:-translate-y-0.5',
    ]"
  >
    <!-- Card Header -->
    <div
      v-if="title || subtitle || $slots.header || collapsible"
      class="px-6 py-4 border-b border-themed"
    >
      <div class="flex items-center justify-between">
        <!-- Header Content -->
        <div class="flex-1">
          <slot name="header">
            <h3 v-if="title" class="text-lg font-semibold text-themed-primary">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="mt-1 text-sm text-themed-muted">
              {{ subtitle }}
            </p>
          </slot>
        </div>

        <!-- Collapse Toggle -->
        <button
          v-if="collapsible"
          @click="toggleCollapse"
          class="ml-4 text-themed-muted hover:text-themed-secondary transition-colors"
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
          <div class="h-4 bg-themed-tertiary rounded animate-pulse"></div>
          <div class="h-4 bg-themed-tertiary rounded animate-pulse w-5/6"></div>
          <div class="h-4 bg-themed-tertiary rounded animate-pulse w-4/6"></div>
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
      class="px-6 py-4 border-t border-themed bg-themed-tertiary"
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
