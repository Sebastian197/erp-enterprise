<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Left Icon -->
      <div
        v-if="icon && iconPosition === 'left'"
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <i :class="[icon, 'text-gray-400']"></i>
      </div>

      <!-- Input Element -->
      <input
        :id="inputId"
        :type="computedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <!-- Right Icon / Password Toggle -->
      <div
        v-if="(icon && iconPosition === 'right') || type === 'password'"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <!-- Password Toggle -->
        <button
          v-if="type === 'password'"
          type="button"
          @click="togglePasswordVisibility"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none"
          :aria-label="showPassword ? $t('input.hide_password') : $t('input.show_password')"
        >
          <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
        </button>

        <!-- Regular Icon -->
        <i
          v-else-if="icon"
          :class="[icon, 'text-gray-400 pointer-events-none']"
        ></i>
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue && !disabled"
        type="button"
        @click="handleClear"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        :aria-label="$t('input.clear')"
      >
        <i class="fas fa-times-circle"></i>
      </button>
    </div>

    <!-- Helper Text / Error Message -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <p
        v-if="error"
        class="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center"
      >
        <i class="fas fa-exclamation-circle mr-1"></i>
        {{ error }}
      </p>
      <p
        v-else-if="helperText"
        class="mt-2 text-sm text-gray-500 dark:text-gray-400"
      >
        {{ helperText }}
      </p>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

/**
 * Input Component
 * Reusable text input with validation, icons, and password toggle
 * Features: Error states, icons, password visibility toggle, clear button
 */

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  type: {
    type: String,
    default: 'text',
    validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(value),
  },
  label: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: null,
  },
  helperText: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
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
  clearable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'clear']);

// State
const showPassword = ref(false);
const isFocused = ref(false);

// Generate unique ID
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);

// Computed type (for password visibility toggle)
const computedType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password';
  }
  return props.type;
});

// Input classes
const inputClasses = computed(() => [
  'block w-full rounded-lg border transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'dark:bg-gray-700 dark:text-white',
  props.icon && props.iconPosition === 'left' ? 'pl-10' : 'pl-4',
  props.icon && props.iconPosition === 'right' || props.type === 'password' || props.clearable ? 'pr-10' : 'pr-4',
  'py-2.5',
  props.error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : isFocused.value
    ? 'border-primary focus:ring-primary focus:border-primary'
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary',
  props.disabled && 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60',
]);

/**
 * Handle input event
 */
const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

/**
 * Handle blur event
 */
const handleBlur = (event) => {
  isFocused.value = false;
  emit('blur', event);
};

/**
 * Handle focus event
 */
const handleFocus = (event) => {
  isFocused.value = true;
  emit('focus', event);
};

/**
 * Toggle password visibility
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

/**
 * Clear input value
 */
const handleClear = () => {
  emit('update:modelValue', '');
  emit('clear');
};
</script>
