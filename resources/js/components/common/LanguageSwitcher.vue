<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :aria-label="$t('language_switcher.label')"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <div class="flex items-center space-x-2">
        <span class="text-xl">{{ currentLocaleData.flag }}</span>
        <span class="hidden lg:block text-sm font-medium">
          {{ currentLocaleData.code.toUpperCase() }}
        </span>
        <i class="hidden lg:block fas fa-chevron-down text-xs"></i>
      </div>
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
        class="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
      >
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {{ $t('language_switcher.select_language') }}
          </p>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="changeLocale(locale.code)"
            :class="[
              'w-full flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors',
              currentLocale === locale.code
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
            ]"
          >
            <span class="text-2xl">{{ locale.flag }}</span>
            <span class="flex-1 text-left">{{ locale.name }}</span>
            <i
              v-if="currentLocale === locale.code"
              class="fas fa-check text-primary"
            ></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { LOCALES, STORAGE_KEYS } from '@/utils/constants';

/**
 * LanguageSwitcher Component
 * Dropdown menu for selecting application language
 * Features: Flag icons, current language highlight, persistent selection
 */

const { locale } = useI18n();

// State
const isOpen = ref(false);
const dropdownRef = ref(null);

// Available locales
const availableLocales = computed(() => Object.values(LOCALES));

// Current locale
const currentLocale = computed(() => locale.value);

// Current locale data
const currentLocaleData = computed(() => {
  return availableLocales.value.find(l => l.code === currentLocale.value) || LOCALES.EN;
});

/**
 * Toggle dropdown
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

/**
 * Change locale
 */
const changeLocale = (code) => {
  locale.value = code;
  localStorage.setItem(STORAGE_KEYS.LOCALE, code);

  // Update document direction for RTL languages
  const localeData = availableLocales.value.find(l => l.code === code);
  if (localeData) {
    document.documentElement.dir = localeData.dir;
  }

  isOpen.value = false;
};

/**
 * Close dropdown on outside click
 */
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  // Set initial document direction
  const localeData = availableLocales.value.find(l => l.code === currentLocale.value);
  if (localeData) {
    document.documentElement.dir = localeData.dir;
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.max-h-96::-webkit-scrollbar {
  width: 6px;
}

.max-h-96::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-96::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .max-h-96::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
