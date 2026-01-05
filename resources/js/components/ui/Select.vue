<template>
  <div class="w-full">
    <!-- Label -->
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Select Container -->
    <div class="relative" ref="selectRef">
      <!-- Select Trigger -->
      <button
        :id="selectId"
        type="button"
        @click="toggleDropdown"
        :disabled="disabled"
        :class="selectClasses"
        :aria-haspopup="true"
        :aria-expanded="isOpen"
      >
        <!-- Selected Value(s) -->
        <span class="block truncate text-left flex-1">
          {{ displayValue }}
        </span>

        <!-- Icon -->
        <span class="flex items-center pointer-events-none">
          <i
            :class="[
              'fas fa-chevron-down text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180',
            ]"
          ></i>
        </span>
      </button>

      <!-- Dropdown Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 mt-1 w-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 max-h-60 overflow-auto"
        >
          <!-- Search Input -->
          <div v-if="searchable" class="p-2 border-b border-gray-200 dark:border-gray-600">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('select.search_placeholder')"
              class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              @click.stop
            />
          </div>

          <!-- Options List -->
          <ul class="py-1">
            <li
              v-for="option in filteredOptions"
              :key="option.value"
              @click="selectOption(option)"
              :class="[
                'px-4 py-2.5 cursor-pointer transition-colors',
                isSelected(option.value)
                  ? 'bg-primary text-white'
                  : 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600',
              ]"
            >
              <div class="flex items-center justify-between">
                <span>{{ option.label }}</span>
                <i
                  v-if="isSelected(option.value)"
                  class="fas fa-check ml-2"
                ></i>
              </div>
            </li>

            <!-- No Results -->
            <li
              v-if="filteredOptions.length === 0"
              class="px-4 py-2.5 text-gray-500 dark:text-gray-400 text-center"
            >
              {{ $t('select.no_results') }}
            </li>
          </ul>
        </div>
      </transition>
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Select Component
 * Reusable select dropdown with search and multiple selection support
 * Features: Searchable, multiple selection, custom options rendering
 */

const props = defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => options.every(opt => opt.value !== undefined && opt.label !== undefined),
  },
  label: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Select an option',
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
  multiple: {
    type: Boolean,
    default: false,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);

const { t } = useI18n();

// State
const isOpen = ref(false);
const searchQuery = ref('');
const selectRef = ref(null);

// Generate unique ID
const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`);

// Select classes
const selectClasses = computed(() => [
  'w-full flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all duration-200',
  'focus:outline-none focus:ring-2 focus:ring-offset-0',
  'dark:bg-gray-700 dark:text-white',
  props.error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-gray-600 focus:ring-primary focus:border-primary',
  props.disabled && 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60',
  !props.disabled && 'hover:border-gray-400 dark:hover:border-gray-500',
]);

// Filtered options based on search
const filteredOptions = computed(() => {
  if (!props.searchable || !searchQuery.value) {
    return props.options;
  }

  const query = searchQuery.value.toLowerCase();
  return props.options.filter(option =>
    option.label.toLowerCase().includes(query)
  );
});

// Display value
const displayValue = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(props.modelValue) || props.modelValue.length === 0) {
      return props.placeholder;
    }
    const selectedOptions = props.options.filter(opt =>
      props.modelValue.includes(opt.value)
    );
    return selectedOptions.map(opt => opt.label).join(', ');
  }

  const selectedOption = props.options.find(opt => opt.value === props.modelValue);
  return selectedOption ? selectedOption.label : props.placeholder;
});

/**
 * Check if option is selected
 */
const isSelected = (value) => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(value);
  }
  return props.modelValue === value;
};

/**
 * Toggle dropdown
 */
const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      searchQuery.value = '';
    }
  }
};

/**
 * Select option
 */
const selectOption = (option) => {
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
    const index = currentValues.indexOf(option.value);

    if (index > -1) {
      currentValues.splice(index, 1);
    } else {
      currentValues.push(option.value);
    }

    emit('update:modelValue', currentValues);
    emit('change', currentValues);
  } else {
    emit('update:modelValue', option.value);
    emit('change', option.value);
    isOpen.value = false;
  }
};

/**
 * Close dropdown on outside click
 */
const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for dropdown */
ul::-webkit-scrollbar {
  width: 6px;
}

ul::-webkit-scrollbar-track {
  background: transparent;
}

ul::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark ul::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
