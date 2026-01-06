<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <span
      v-if="loading"
      class="inline-block animate-spin mr-2"
    >
      <i class="fas fa-circle-notch"></i>
    </span>

    <!-- Left Icon -->
    <i
      v-if="icon && iconPosition === 'left' && !loading"
      :class="[icon, iconSizeClass, 'mr-2']"
    ></i>

    <!-- Button Text/Content -->
    <span>
      <slot></slot>
    </span>

    <!-- Right Icon -->
    <i
      v-if="icon && iconPosition === 'right' && !loading"
      :class="[icon, iconSizeClass, 'ml-2']"
    ></i>

    <!-- Ripple Effect -->
    <span
      v-if="ripple"
      ref="rippleRef"
      class="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
    ></span>
  </button>
</template>

<script setup>
import { computed, ref } from 'vue';

/**
 * Button Component
 * Reusable button with multiple variants, sizes, icons, and loading state
 * Features: Ripple effect, icon support, disabled state, full-width option
 */

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'ghost', 'outline'].includes(value),
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: null,
  },
  iconPosition: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'right'].includes(value),
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  ripple: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['click']);

const rippleRef = ref(null);

// Variant classes - using theme-aware utilities
const variantClasses = {
  primary: 'btn-themed-primary hover:opacity-90 text-white shadow-sm hover:shadow-md',
  secondary: 'btn-themed-secondary hover:opacity-90 text-white shadow-sm hover:shadow-md',
  success: 'btn-themed-success hover:opacity-90 text-white shadow-sm hover:shadow-md',
  danger: 'btn-themed-danger hover:opacity-90 text-white shadow-sm hover:shadow-md',
  warning: 'btn-themed-warning hover:opacity-90 text-white shadow-sm hover:shadow-md',
  info: 'btn-themed-info hover:opacity-90 text-white shadow-sm hover:shadow-md',
  ghost: 'bg-transparent hover:bg-themed-tertiary text-themed-primary',
  outline: 'bg-transparent border-2 border-current btn-themed-primary hover:text-white text-themed-primary',
};

// Size classes
const sizeClasses = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-5 py-3 text-lg',
  xl: 'px-6 py-4 text-xl',
};

// Icon size classes
const iconSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

const iconSizeClass = computed(() => iconSizeClasses[props.size]);

// Combined button classes
const buttonClasses = computed(() => [
  'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
  variantClasses[props.variant],
  sizeClasses[props.size],
  props.fullWidth && 'w-full',
  (props.disabled || props.loading) && 'opacity-50 cursor-not-allowed',
  !props.disabled && !props.loading && 'active:scale-95',
]);

/**
 * Handle button click with ripple effect
 */
const handleClick = (event) => {
  if (props.disabled || props.loading) return;

  // Create ripple effect
  if (props.ripple && rippleRef.value) {
    const rippleElement = rippleRef.value;
    const rect = rippleElement.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
    `;

    rippleElement.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  emit('click', event);
};
</script>

<style scoped>
@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>