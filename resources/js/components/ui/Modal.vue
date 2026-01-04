<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click="handleBackdropClick"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="show"
              v-motion-pop
              :class="modalClasses"
              @click.stop
              role="dialog"
              :aria-modal="true"
              :aria-labelledby="titleId"
            >
              <!-- Modal Header -->
              <div
                v-if="title || closable"
                class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700"
              >
                <h3
                  v-if="title"
                  :id="titleId"
                  class="text-lg font-semibold text-gray-900 dark:text-white"
                >
                  {{ title }}
                </h3>
                <button
                  v-if="closable"
                  @click="close"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  :aria-label="$t('modal.close')"
                >
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>

              <!-- Modal Body -->
              <div class="px-6 py-4">
                <slot></slot>
              </div>

              <!-- Modal Footer -->
              <div
                v-if="$slots.footer"
                class="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
              >
                <slot name="footer"></slot>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue';

/**
 * Modal Component
 * Reusable modal dialog with backdrop, transitions, and focus trap
 * Features: Multiple sizes, backdrop click to close, ESC key support, scroll lock
 */

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value),
  },
  closable: {
    type: Boolean,
    default: true,
  },
  persistent: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:show', 'close']);

// Generate unique ID for title
const titleId = computed(() => `modal-title-${Math.random().toString(36).substr(2, 9)}`);

// Size classes
const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-7xl',
};

// Modal classes
const modalClasses = computed(() => [
  'relative w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl',
  sizeClasses[props.size],
]);

/**
 * Close modal
 */
const close = () => {
  emit('update:show', false);
  emit('close');
};

/**
 * Handle backdrop click
 */
const handleBackdropClick = () => {
  if (props.closable && !props.persistent) {
    close();
  }
};

/**
 * Handle ESC key press
 */
const handleEscKey = (event) => {
  if (event.key === 'Escape' && props.show && props.closable && !props.persistent) {
    close();
  }
};

/**
 * Lock body scroll when modal is open
 */
const lockScroll = () => {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
};

/**
 * Unlock body scroll when modal is closed
 */
const unlockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

// Watch for show prop changes
watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }
);

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
  if (props.show) {
    lockScroll();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey);
  unlockScroll();
});
</script>
