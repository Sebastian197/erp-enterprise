<template>
  <div class="relative inline-block" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:scale-105 active:scale-95"
      :aria-label="$t('language_switcher.label')"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <span class="text-2xl">{{ currentLocaleData.flag }}</span>
      <span class="text-sm font-medium">
        {{ currentLocaleData.code.toUpperCase() }}
      </span>
      <i
        class="fas fa-chevron-down text-xs transition-transform duration-300 ease-out"
        :class="{ 'rotate-180': isOpen }"
      ></i>
    </button>

    <!-- Backdrop -->
    <transition
      enter-active-class="backdrop-enter-active"
      enter-from-class="backdrop-enter-from"
      enter-to-class="backdrop-enter-to"
      leave-active-class="backdrop-leave-active"
      leave-from-class="backdrop-leave-from"
      leave-to-class="backdrop-leave-to"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm"
        style="z-index: 9998;"
        @click="isOpen = false"
      ></div>
    </transition>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="dropdown-enter-active"
      enter-from-class="dropdown-enter-from"
      enter-to-class="dropdown-enter-to"
      leave-active-class="dropdown-leave-active"
      leave-from-class="dropdown-leave-from"
      leave-to-class="dropdown-leave-to"
    >
      <div
        v-if="isOpen"
        class="fixed left-1/2 top-1/2 w-80 bg-white/98 dark:bg-gray-800/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden dropdown-container"
        style="z-index: 9999; transform: translate(-50%, -50%);"
      >
        <div class="px-5 py-3 border-b border-gray-200/70 dark:border-gray-700/70 bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/20 flex-shrink-0">
          <p class="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center">
            <i class="fas fa-language mr-2 text-primary-500"></i>
            {{ $t('language_switcher.select_language') }}
          </p>
        </div>

        <div class="overflow-y-auto custom-scrollbar language-list">
          <button
            v-for="(locale, index) in availableLocales"
            :key="locale.code"
            @click="changeLocale(locale.code)"
            :class="[
              'language-item w-full flex items-center space-x-3 px-5 py-3 text-sm transition-all duration-300',
              currentLocale === locale.code
                ? 'bg-primary-500/15 text-primary-600 dark:text-primary-400 font-semibold border-l-4 border-primary-500'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 hover:pl-6 border-l-4 border-transparent hover:border-primary-300',
            ]"
            :style="{ '--item-index': index }"
          >
            <span class="text-2xl flex-shrink-0">{{ locale.flag }}</span>
            <span class="flex-1 text-left">{{ locale.name }}</span>
            <i
              v-if="currentLocale === locale.code"
              class="fas fa-check-circle text-primary-500 flex-shrink-0 animate-bounce-in"
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
import { LOCALES, STORAGE_KEYS, API_ENDPOINTS } from '@/utils/constants';
import { setI18nLocale } from '@/i18n';
import { useAuthStore } from '@/stores/auth';
import api from '@/utils/api';

/**
 * LanguageSwitcher Component
 * Dropdown menu for selecting application language
 * Features: Flag icons, current language highlight, persistent selection
 */

const { locale } = useI18n();
const authStore = useAuthStore();

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
const changeLocale = async (code) => {
  try {
    // Load and set the new locale
    await setI18nLocale(code);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.LOCALE, code);

    // Check if user is authenticated by verifying token in localStorage
    const hasToken = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const isAuth = authStore.isAuthenticated || hasToken;

    // Save to backend if user is authenticated
    if (isAuth) {
      try {
        await api.put(API_ENDPOINTS.PREFERENCES.LOCALE, {
          locale: code,
        });
      } catch (error) {
        console.error('Failed to save locale preference to backend:', error);
        // Continue anyway since localStorage is updated
      }
    }

    isOpen.value = false;
  } catch (error) {
    console.error('Failed to change locale:', error);
  }
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
/* Dropdown container with fixed height for scrolling */
.dropdown-container {
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.language-list {
  max-height: 540px;
  flex: 1;
  overflow-y: auto;
}

/* Custom scrollbar for dropdown */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 0;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.3) 0%, rgba(99, 102, 241, 0.5) 100%);
  border-radius: 10px;
  border: 2px solid transparent;
  background-clip: padding-box;
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.5) 0%, rgba(99, 102, 241, 0.7) 100%);
  background-clip: padding-box;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(165, 180, 252, 0.3) 0%, rgba(165, 180, 252, 0.5) 100%);
  background-clip: padding-box;
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(165, 180, 252, 0.5) 0%, rgba(165, 180, 252, 0.7) 100%);
  background-clip: padding-box;
}

/* Smooth scroll behavior */
.language-list {
  scroll-behavior: smooth;
}

/* Backdrop animations - Simple and smooth */
.backdrop-enter-active {
  animation: backdrop-fade-in 0.3s ease-out;
}

.backdrop-leave-active {
  animation: backdrop-fade-out 0.25s ease-in;
}

@keyframes backdrop-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes backdrop-fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Dropdown animations - Ultra smooth without any jumps */
.dropdown-enter-active {
  animation: dropdown-enter 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.dropdown-leave-active {
  animation: dropdown-leave 0.25s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

@keyframes dropdown-enter {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes dropdown-leave {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}

/* Language items staggered animation - Delayed smooth slide */
.language-item {
  animation: item-slide-in 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) backwards;
  animation-delay: calc(var(--item-index, 0) * 35ms + 150ms);
}

@keyframes item-slide-in {
  0% {
    opacity: 0;
    transform: translateX(-15px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Check icon bounce animation - Smooth bounce */
.animate-bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform, opacity;
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Optimize rendering performance */
.dropdown-container,
.language-item {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Responsive height for smaller screens */
@media (max-height: 700px) {
  .dropdown-container {
    max-height: 80vh;
  }

  .language-list {
    max-height: calc(80vh - 60px);
  }
}

@media (max-height: 500px) {
  .dropdown-container {
    max-height: 70vh;
  }

  .language-list {
    max-height: calc(70vh - 60px);
  }
}
</style>
