<template>
  <header class="h-16 bg-navbar border-b border-navbar flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
    <!-- Left Section -->
    <div class="flex items-center space-x-4">
      <!-- Menu Toggle -->
      <button
        @click="$emit('toggle-sidebar')"
        class="text-navbar hover:text-themed-primary transition-colors"
        :aria-label="$t('navbar.toggle_menu')"
      >
        <i class="fas fa-bars text-xl"></i>
      </button>

      <!-- Search Bar (Optional) -->
      <div class="hidden md:block">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('navbar.search_placeholder')"
            class="w-64 pl-10 pr-4 py-2 rounded-lg bg-input border-input border-input-focus text-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            @keyup.enter="handleSearch"
          />
          <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center space-x-2 lg:space-x-4">
      <!-- Search Icon (Mobile) -->
      <button
        class="md:hidden p-2 text-navbar hover:text-themed-primary transition-colors"
        @click="showMobileSearch = true"
        :aria-label="$t('navbar.search')"
      >
        <i class="fas fa-search"></i>
      </button>

      <!-- Language Switcher -->
      <LanguageSwitcher />

      <!-- Theme Switcher -->
      <ThemeSwitcher />

      <!-- Notifications -->
      <NotificationDropdown />

      <!-- User Dropdown -->
      <div class="relative" ref="userMenuRef">
        <button
          @click="toggleUserMenu"
          class="flex items-center space-x-2 p-2 rounded-lg hover:bg-themed-tertiary transition-colors"
          :aria-label="$t('navbar.user_menu')"
          aria-haspopup="true"
          :aria-expanded="showUserMenu"
        >
          <img
            v-if="userAvatar"
            :src="userAvatar"
            :alt="userName"
            class="w-8 h-8 rounded-full object-cover"
          />
          <div
            v-else
            class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          >
            <span class="text-white font-semibold text-xs">
              {{ userInitials }}
            </span>
          </div>
          <span class="hidden lg:block text-sm font-medium text-navbar">
            {{ userName }}
          </span>
          <i class="hidden lg:block fas fa-chevron-down text-xs text-gray-400"></i>
        </button>

        <!-- User Dropdown Menu -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-card border-card py-2 z-50"
          >
            <!-- User Info -->
            <div class="px-4 py-3 border-b border-themed">
              <p class="text-sm font-semibold text-themed-primary">
                {{ userName }}
              </p>
              <p class="text-xs text-themed-muted truncate">
                {{ userEmail }}
              </p>
            </div>

            <!-- Menu Items -->
            <router-link
              to="/profile"
              @click="closeUserMenu"
              class="flex items-center space-x-3 px-4 py-2 text-sm text-themed-secondary hover:bg-themed-tertiary transition-colors"
            >
              <i class="fas fa-user w-4"></i>
              <span>{{ $t('navbar.my_profile') }}</span>
            </router-link>

            <router-link
              to="/settings"
              @click="closeUserMenu"
              class="flex items-center space-x-3 px-4 py-2 text-sm text-themed-secondary hover:bg-themed-tertiary transition-colors"
            >
              <i class="fas fa-cog w-4"></i>
              <span>{{ $t('navbar.settings') }}</span>
            </router-link>

            <div class="border-t border-themed my-2"></div>

            <button
              @click="handleLogout"
              class="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              :disabled="loggingOut"
            >
              <i class="fas fa-sign-out-alt w-4"></i>
              <span>{{ loggingOut ? $t('navbar.logging_out') : $t('navbar.logout') }}</span>
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Mobile Search Modal -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showMobileSearch"
        class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
        @click="showMobileSearch = false"
      >
        <div
          class="w-full max-w-lg bg-card rounded-lg shadow-xl p-4"
          @click.stop
        >
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="$t('navbar.search_placeholder')"
              class="w-full pl-10 pr-4 py-3 rounded-lg bg-input border-input border-input-focus text-input focus:outline-none focus:ring-2 focus:ring-primary"
              @keyup.enter="handleSearch"
              autofocus
            />
            <i class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';
import NotificationDropdown from '@/components/common/NotificationDropdown.vue';

/**
 * Navbar Component
 * Top navigation bar with search, language switcher, theme switcher, notifications, and user menu
 * Features: Responsive design, dropdown menus, search functionality
 */

defineProps({
  sidebarCollapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();

// State
const searchQuery = ref('');
const showUserMenu = ref(false);
const showMobileSearch = ref(false);
const loggingOut = ref(false);
const userMenuRef = ref(null);

// Computed
const userName = computed(() => authStore.userName);
const userEmail = computed(() => authStore.userEmail);
const userAvatar = computed(() => authStore.userAvatar);
const userInitials = computed(() => {
  const name = authStore.userName || 'User';
  const parts = name.split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.substring(0, 2).toUpperCase();
});

/**
 * Toggle user menu dropdown
 */
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

/**
 * Close user menu
 */
const closeUserMenu = () => {
  showUserMenu.value = false;
};

/**
 * Handle search
 */
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { q: searchQuery.value },
    });
    showMobileSearch.value = false;
  }
};

/**
 * Handle logout
 */
const handleLogout = async () => {
  try {
    loggingOut.value = true;
    await authStore.logout();
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    loggingOut.value = false;
  }
};

/**
 * Close dropdowns on outside click
 */
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false;
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
