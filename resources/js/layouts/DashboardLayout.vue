<template>
  <div class="min-h-screen bg-themed-secondary flex">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      @toggle="toggleSidebar"
    />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col transition-all duration-300"
      :class="sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'"
    >
      <!-- Navbar -->
      <Navbar
        :sidebar-collapsed="sidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Breadcrumbs -->
      <div class="bg-navbar border-b border-navbar px-4 lg:px-6 py-3">
        <nav class="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
          <router-link
            to="/dashboard"
            class="text-themed-secondary hover:text-primary transition-colors"
          >
            <i class="fas fa-home"></i>
          </router-link>

          <template v-if="breadcrumbs.length > 0">
            <span class="text-muted">/</span>

            <template v-for="(crumb, index) in breadcrumbs" :key="index">
              <router-link
                v-if="crumb.to && index < breadcrumbs.length - 1"
                :to="crumb.to"
                class="text-themed-secondary hover:text-primary transition-colors"
              >
                {{ crumb.label }}
              </router-link>

              <span
                v-else
                class="text-themed-primary font-medium"
              >
                {{ crumb.label }}
              </span>

              <span
                v-if="index < breadcrumbs.length - 1"
                class="text-muted"
              >
                /
              </span>
            </template>
          </template>
        </nav>
      </div>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-themed-secondary p-4 lg:p-6 relative">
        <!-- Naval Background with low intensity -->
        <div class="dashboard-naval-background">
          <NavalBackground intensity="low" />
        </div>

        <div class="relative z-10">
          <router-view v-slot="{ Component }">
          <transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </router-view>
        </div>
      </main>

      <!-- Footer -->
      <Footer />
    </div>

    <!-- Mobile Sidebar Overlay -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="!sidebarCollapsed && isMobile"
        class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        @click="toggleSidebar"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Sidebar from '@/components/dashboard/Sidebar.vue';
import Navbar from '@/components/dashboard/Navbar.vue';
import Footer from '@/components/dashboard/Footer.vue';
import NavalBackground from '@/components/common/NavalBackground.vue';
import { STORAGE_KEYS } from '@/utils/constants';

/**
 * DashboardLayout Component
 * Main application layout with sidebar, navbar, breadcrumbs, and content area
 * Features: Responsive sidebar, breadcrumb navigation, mobile-friendly
 */

const route = useRoute();
const { t } = useI18n();

// State
const sidebarCollapsed = ref(false);
const isMobile = ref(false);

// Breadcrumbs from route meta
const breadcrumbs = computed(() => {
  const crumbs = [];
  const matched = route.matched;

  matched.forEach((routeRecord, index) => {
    if (routeRecord.meta?.title) {
      const isLast = index === matched.length - 1;
      crumbs.push({
        label: t(routeRecord.meta.title) || routeRecord.meta.title,
        to: isLast ? null : routeRecord.path,
      });
    }
  });

  return crumbs;
});

/**
 * Toggle sidebar collapsed state
 */
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, sidebarCollapsed.value ? '1' : '0');

  // Emit custom event for same-window components
  window.dispatchEvent(new CustomEvent('sidebar-toggle'));
};

/**
 * Check if viewport is mobile
 */
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024;

  // Auto-collapse sidebar on mobile
  if (isMobile.value && !sidebarCollapsed.value) {
    sidebarCollapsed.value = true;
  }
};

/**
 * Handle window resize
 */
const handleResize = () => {
  checkMobile();
};

/**
 * Initialize sidebar state from localStorage
 */
const initSidebar = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
  if (stored !== null) {
    sidebarCollapsed.value = stored === '1';
  }
  checkMobile();
};

// Lifecycle
onMounted(() => {
  initSidebar();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  if (isMobile.value && !sidebarCollapsed.value) {
    sidebarCollapsed.value = true;
  }
});
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dashboard naval background */
.dashboard-naval-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  pointer-events: none;
  z-index: 0;
}
</style>
