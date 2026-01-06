<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :aria-label="$t('theme_switcher.label')"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <i :class="isDark ? 'fas fa-moon' : 'fas fa-sun'"></i>
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
        class="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
      >
        <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
            {{ $t('theme_switcher.select_theme') }}
          </p>
        </div>

        <!-- Quick Dark Mode Toggle -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <button
            @click="toggleDarkMode"
            class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <i :class="[isDark ? 'fas fa-moon' : 'fas fa-sun', 'text-lg']"></i>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ isDark ? $t('theme_switcher.light_mode') : $t('theme_switcher.dark_mode') }}
              </span>
            </div>
            <div
              :class="[
                'w-12 h-6 rounded-full transition-colors',
                isDark ? 'bg-primary' : 'bg-gray-300',
              ]"
            >
              <div
                :class="[
                  'w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 mx-0.5',
                  isDark && 'translate-x-6',
                ]"
              ></div>
            </div>
          </button>
        </div>

        <!-- Theme List -->
        <div class="max-h-80 overflow-y-auto p-2">
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="theme in availableThemes"
              :key="theme.id"
              @click="selectTheme(theme.id)"
              :class="[
                'flex flex-col items-center p-3 rounded-lg border-2 transition-all',
                currentTheme === theme.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              ]"
            >
              <!-- Theme Color Preview -->
              <div class="flex space-x-1 mb-2">
                <div
                  v-for="i in 3"
                  :key="i"
                  :class="[
                    'w-4 h-4 rounded-full',
                    getThemeColorClass(theme.id, i),
                  ]"
                ></div>
              </div>

              <!-- Theme Name -->
              <span
                :class="[
                  'text-xs font-medium',
                  currentTheme === theme.id
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300',
                ]"
              >
                {{ theme.name }}
              </span>

              <!-- Dark Badge -->
              <span
                v-if="theme.dark"
                class="mt-1 px-2 py-0.5 text-xs bg-gray-800 text-white rounded"
              >
                {{ $t('theme_switcher.dark') }}
              </span>

              <!-- Check Icon -->
              <i
                v-if="currentTheme === theme.id"
                class="fas fa-check text-primary mt-1"
              ></i>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useThemeStore } from '@/stores/theme';

/**
 * ThemeSwitcher Component
 * Dropdown menu for selecting application theme
 * Features: Theme preview, dark mode toggle, current theme highlight
 */

const themeStore = useThemeStore();

// State
const isOpen = ref(false);
const dropdownRef = ref(null);

// Computed
const currentTheme = computed(() => themeStore.currentTheme);
const isDark = computed(() => themeStore.isDark);
const availableThemes = computed(() => themeStore.availableThemes);

/**
 * Toggle dropdown
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

/**
 * Toggle dark mode
 */
const toggleDarkMode = async () => {
  await themeStore.toggleDarkMode();
};

/**
 * Select theme
 */
const selectTheme = async (themeId) => {
  await themeStore.setTheme(themeId);
  isOpen.value = false;
};

/**
 * Get theme color class for preview
 */
const getThemeColorClass = (themeId, index) => {
  const colorMap = {
    'default-light': ['bg-blue-500', 'bg-gray-500', 'bg-green-500'],
    'default-dark': ['bg-blue-600', 'bg-gray-800', 'bg-green-600'],
    'blue-ocean': ['bg-blue-400', 'bg-blue-600', 'bg-cyan-500'],
    'purple-dream': ['bg-purple-400', 'bg-purple-600', 'bg-pink-500'],
    'green-nature': ['bg-green-400', 'bg-green-600', 'bg-lime-500'],
    'orange-sunset': ['bg-orange-400', 'bg-orange-600', 'bg-yellow-500'],
    'red-fire': ['bg-red-400', 'bg-red-600', 'bg-orange-500'],
    'gray-professional': ['bg-gray-400', 'bg-gray-600', 'bg-gray-800'],
    'teal-modern': ['bg-teal-400', 'bg-teal-600', 'bg-cyan-500'],
    'pink-soft': ['bg-pink-300', 'bg-pink-400', 'bg-rose-400'],
    'high-contrast': ['bg-black', 'bg-white', 'bg-yellow-400'],
    'custom': ['bg-primary', 'bg-secondary', 'bg-gray-500'],
  };

  return colorMap[themeId]?.[index - 1] || 'bg-gray-400';
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
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.max-h-80::-webkit-scrollbar {
  width: 6px;
}

.max-h-80::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-80::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.dark .max-h-80::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
