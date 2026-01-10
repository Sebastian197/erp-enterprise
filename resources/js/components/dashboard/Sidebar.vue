<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-full bg-sidebar border-r border-themed transition-all duration-300 z-40',
      // Desktop behavior
      'lg:translate-x-0',
      collapsed ? 'lg:w-20' : 'lg:w-64',
      // Mobile/Tablet behavior
      'w-64',
      collapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0',
    ]"
    :aria-label="$t('sidebar.label')"
  >
    <!-- Logo Section -->
    <div class="h-16 flex items-center justify-center border-b border-themed px-4">
      <router-link
        to="/dashboard"
        class="flex items-center space-x-3 transition-opacity hover:opacity-80"
      >
        <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <i class="fas fa-building text-white text-lg"></i>
        </div>
        <transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <span
            v-if="!collapsed"
            class="text-xl font-bold text-sidebar"
          >
            {{ appName }}
          </span>
        </transition>
      </router-link>
    </div>

    <!-- User Info Section -->
    <div class="p-4 border-b border-themed">
      <div class="flex items-center space-x-3">
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <img
            v-if="userAvatar"
            :src="userAvatar"
            :alt="userName"
            class="w-10 h-10 rounded-full object-cover"
          />
          <div
            v-else
            class="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
          >
            <span class="text-white font-semibold text-sm">
              {{ userInitials }}
            </span>
          </div>
          <span
            class="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-sidebar rounded-full"
            :title="$t('sidebar.online')"
          ></span>
        </div>

        <!-- User Info -->
        <transition
          enter-active-class="transition duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-sidebar truncate">
              {{ userName }}
            </p>
            <p class="text-xs text-sidebar opacity-75 truncate">
              {{ userEmail }}
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto p-4 space-y-1" :aria-label="$t('sidebar.navigation')">
      <template v-for="item in visibleMenuItems" :key="item.route">
        <!-- Single Menu Item -->
        <router-link
          v-if="!item.children"
          :to="item.route"
          v-slot="{ isActive }"
          custom
        >
          <a
            :href="item.route"
            @click.prevent="navigateTo(item.route)"
            :class="[
              'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              isActive
                ? 'bg-sidebar-active text-white shadow-md'
                : 'text-sidebar hover:bg-sidebar-hover',
            ]"
            :title="collapsed ? item.name : ''"
          >
            <i :class="[item.icon, 'text-lg w-5 flex-shrink-0']"></i>
            <transition
              enter-active-class="transition duration-200"
              enter-from-class="opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition duration-150"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <span v-if="!collapsed" class="font-medium">
                {{ $t(item.i18nKey) }}
              </span>
            </transition>
          </a>
        </router-link>

        <!-- Menu Item with Children (future expansion) -->
        <div v-else class="space-y-1">
          <button
            @click="toggleSubmenu(item.route)"
            :class="[
              'w-full flex items-center justify-between space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              'text-sidebar hover:bg-sidebar-hover',
            ]"
          >
            <div class="flex items-center space-x-3">
              <i :class="[item.icon, 'text-lg w-5']"></i>
              <span v-if="!collapsed" class="font-medium">
                {{ $t(item.i18nKey) }}
              </span>
            </div>
            <i
              v-if="!collapsed"
              :class="[
                'fas fa-chevron-down text-xs transition-transform duration-200',
                expandedMenus.includes(item.route) && 'rotate-180',
              ]"
            ></i>
          </button>

          <!-- Submenu -->
          <transition
            enter-active-class="transition duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="expandedMenus.includes(item.route) && !collapsed"
              class="ml-8 space-y-1 mt-1"
            >
              <template v-for="child in item.children" :key="child.route">
                <!-- Child without children (simple link) -->
                <router-link
                  v-if="!child.children"
                  :to="child.route"
                  v-slot="{ isActive }"
                  custom
                >
                  <a
                    :href="child.route"
                    @click.prevent="navigateTo(child.route)"
                    :class="[
                      'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                      isActive
                        ? 'text-primary font-medium bg-primary/10'
                        : 'text-themed-secondary hover:text-themed-primary',
                    ]"
                  >
                    <i v-if="child.icon" :class="[child.icon, 'text-sm w-4']"></i>
                    <span>{{ $t(child.i18nKey) }}</span>
                  </a>
                </router-link>

                <!-- Child with children (nested submenu) -->
                <div v-else class="space-y-1">
                  <button
                    @click="toggleSubmenu(child.route)"
                    :class="[
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                      'text-themed-secondary hover:text-themed-primary',
                    ]"
                  >
                    <div class="flex items-center space-x-2">
                      <i v-if="child.icon" :class="[child.icon, 'text-sm w-4']"></i>
                      <span>{{ $t(child.i18nKey) }}</span>
                    </div>
                    <i
                      :class="[
                        'fas fa-chevron-down text-xs transition-transform duration-200',
                        expandedMenus.includes(child.route) && 'rotate-180',
                      ]"
                    ></i>
                  </button>

                  <!-- Third level submenu -->
                  <transition
                    enter-active-class="transition duration-200"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div
                      v-if="expandedMenus.includes(child.route)"
                      class="ml-4 space-y-1 mt-1"
                    >
                      <router-link
                        v-for="subChild in child.children"
                        :key="subChild.route"
                        :to="subChild.route"
                        v-slot="{ isActive }"
                        custom
                      >
                        <a
                          :href="subChild.route"
                          @click.prevent="navigateTo(subChild.route)"
                          :class="[
                            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200',
                            isActive
                              ? 'text-primary font-medium bg-primary/10'
                              : 'text-themed-secondary hover:text-themed-primary',
                          ]"
                        >
                          <i v-if="subChild.icon" :class="[subChild.icon, 'text-sm w-4']"></i>
                          <span>{{ $t(subChild.i18nKey) }}</span>
                        </a>
                      </router-link>
                    </div>
                  </transition>
                </div>
              </template>
            </div>
          </transition>
        </div>
      </template>
    </nav>

  </aside>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { APP } from '@/utils/constants';
import { menuItems as menuConfig } from '@/config/menu';

/**
 * Sidebar Component
 * Main navigation sidebar with collapsible menu items
 * Features: Permission-based menu, user info, active route highlighting, responsive
 */

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['toggle']);

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// State
const expandedMenus = ref([]);

// Computed
const appName = computed(() => APP.NAME);
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

// Menu items from config
const menuItems = menuConfig;

// Filter menu items based on permissions
const visibleMenuItems = computed(() => {
  return menuItems.filter(item => {
    if (!item.permission) return true;
    return authStore.can(item.permission);
  });
});

/**
 * Navigate to route
 * @param {string} route - Route path
 */
const navigateTo = async (routePath) => {
  await router.push(routePath);
};

/**
 * Toggle submenu expansion
 * @param {string} route - Parent route
 */
const toggleSubmenu = (route) => {
  const index = expandedMenus.value.indexOf(route);
  if (index > -1) {
    expandedMenus.value.splice(index, 1);
  } else {
    expandedMenus.value.push(route);
  }
};
</script>

<style scoped>
/* Custom scrollbar for sidebar */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
}

.dark nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
