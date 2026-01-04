<template>
  <div :class="containerClasses">
    <!-- Spinner Type -->
    <div v-if="type === 'spinner'" :class="spinnerClasses">
      <i class="fas fa-circle-notch animate-spin"></i>
    </div>

    <!-- Dots Type -->
    <div v-else-if="type === 'dots'" class="flex space-x-2">
      <div
        v-for="i in 3"
        :key="i"
        :class="[
          'rounded-full bg-primary animate-bounce',
          dotSizeClasses,
        ]"
        :style="{ animationDelay: `${i * 0.15}s` }"
      ></div>
    </div>

    <!-- Pulse Type -->
    <div v-else-if="type === 'pulse'" :class="pulseClasses">
      <div class="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
      <div class="relative bg-primary rounded-full"></div>
    </div>

    <!-- Skeleton Type -->
    <div v-else-if="type === 'skeleton'" class="w-full space-y-3">
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
    </div>

    <!-- Loading Text -->
    <p
      v-if="text"
      class="mt-4 text-sm text-gray-600 dark:text-gray-400 font-medium"
    >
      {{ text }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

/**
 * Loading Component
 * Versatile loading indicator with multiple styles and sizes
 * Features: Multiple loading types, fullscreen overlay option, customizable colors
 */

const props = defineProps({
  type: {
    type: String,
    default: 'spinner',
    validator: (value) => ['spinner', 'skeleton', 'dots', 'pulse'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: null,
  },
});

// Size mappings
const sizeMap = {
  sm: {
    spinner: 'text-2xl',
    dot: 'w-2 h-2',
    pulse: 'w-8 h-8',
  },
  md: {
    spinner: 'text-4xl',
    dot: 'w-3 h-3',
    pulse: 'w-12 h-12',
  },
  lg: {
    spinner: 'text-6xl',
    dot: 'w-4 h-4',
    pulse: 'w-16 h-16',
  },
  xl: {
    spinner: 'text-8xl',
    dot: 'w-6 h-6',
    pulse: 'w-24 h-24',
  },
};

// Container classes
const containerClasses = computed(() => [
  'flex flex-col items-center justify-center',
  props.fullscreen && 'fixed inset-0 z-50 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm',
  !props.fullscreen && 'py-8',
]);

// Spinner classes
const spinnerClasses = computed(() => [
  'text-primary',
  sizeMap[props.size].spinner,
]);

// Dot size classes
const dotSizeClasses = computed(() => sizeMap[props.size].dot);

// Pulse classes
const pulseClasses = computed(() => [
  'relative inline-flex',
  sizeMap[props.size].pulse,
]);
</script>

<style scoped>
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
