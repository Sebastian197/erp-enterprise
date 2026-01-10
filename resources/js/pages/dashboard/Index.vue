<template>
  <div>
    <!-- Welcome Animation -->
    <WelcomeAnimation
      v-if="showWelcome"
      :text="t('dashboard.welcome', { name: userName })"
      :subtitle="t('dashboard.subtitle')"
      :duration="2000"
      :sidebar-collapsed="sidebarCollapsed"
      @complete="onWelcomeComplete"
    />

    <div v-if="!showWelcome">
      <!-- Edit Mode Banner -->
      <div
        v-if="contentVisible && editMode"
        class="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-primary text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-4 animate-slideDown"
      >
        <i class="fas fa-edit text-lg"></i>
        <span class="font-medium">Modo de Edición Activo - Arrastra y redimensiona los componentes</span>
        <div class="flex space-x-2 ml-4">
          <button
            @click="saveAndExit"
            class="px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-all flex items-center space-x-2"
          >
            <i class="fas fa-save"></i>
            <span>{{ t('common.save') }}</span>
          </button>
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-transparent border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center space-x-2"
          >
            <i class="fas fa-times"></i>
            <span>{{ t('common.cancel') }}</span>
          </button>
        </div>
      </div>

      <!-- Grid Layout -->
      <GridLayout
        v-if="contentVisible && layout.length > 0"
        v-model:layout="layout"
        :col-num="12"
        :row-height="30"
        :is-draggable="editMode"
        :is-resizable="editMode"
        :vertical-compact="true"
        :use-css-transforms="true"
        :margin="[16, 16]"
        @layout-updated="onLayoutUpdated"
        class="animate-fadeInUp"
        style="animation-delay: 0.1s"
      >
        <!-- Stats Widgets -->
        <GridItem
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :class="editMode ? 'dashboard-item-edit' : 'dashboard-item'"
        >
          <!-- Stats Section -->
          <div v-if="item.i === 'stats'" class="h-full overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full auto-rows-fr">
              <Widget
                :title="$t('dashboard.stats.total_users')"
                :value="stats.totalUsers"
                icon="fas fa-users"
                color="primary"
                :loading="loading"
                :trend="stats.usersTrend"
              />
              <Widget
                :title="$t('dashboard.stats.active_users')"
                :value="stats.activeUsers"
                icon="fas fa-user-check"
                color="success"
                :loading="loading"
                :trend="stats.activeUsersTrend"
              />
              <Widget
                :title="$t('dashboard.stats.total_groups')"
                :value="stats.totalGroups"
                icon="fas fa-folder"
                color="info"
                :loading="loading"
              />
              <Widget
                :title="$t('dashboard.stats.total_categories')"
                :value="stats.totalCategories"
                icon="fas fa-tags"
                color="warning"
                :loading="loading"
              />
            </div>
          </div>

          <!-- Quick Actions Section -->
          <Card
            v-else-if="item.i === 'quick-actions'"
            :title="$t('dashboard.quick_actions.title')"
            class="h-full overflow-auto flex flex-col quick-actions-card"
          >
            <div class="flex flex-wrap gap-3 justify-start">
              <button
                v-if="can('users.create')"
                @click="async () => await router.push('/users/create')"
                :title="$t('dashboard.quick_actions.create_user')"
                class="quick-action-btn bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover hover:scale-105 transition-all group"
              >
                <i class="fas fa-user-plus text-primary group-hover:scale-110 transition-transform"></i>
                <span class="quick-action-text text-themed-primary">
                  {{ $t('dashboard.quick_actions.create_user') }}
                </span>
              </button>

              <button
                v-if="can('groups.create')"
                @click="async () => await router.push('/groups/create')"
                :title="$t('dashboard.quick_actions.create_group')"
                class="quick-action-btn bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover hover:scale-105 transition-all group"
              >
                <i class="fas fa-folder-plus text-success group-hover:scale-110 transition-transform"></i>
                <span class="quick-action-text text-themed-primary">
                  {{ $t('dashboard.quick_actions.create_group') }}
                </span>
              </button>

              <button
                v-if="can('categories.create')"
                @click="async () => await router.push('/categories/create')"
                :title="$t('dashboard.quick_actions.create_category')"
                class="quick-action-btn bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover hover:scale-105 transition-all group"
              >
                <i class="fas fa-tag text-warning group-hover:scale-110 transition-transform"></i>
                <span class="quick-action-text text-themed-primary">
                  {{ $t('dashboard.quick_actions.create_category') }}
                </span>
              </button>

              <button
                @click="async () => await router.push('/settings')"
                :title="$t('dashboard.quick_actions.settings')"
                class="quick-action-btn bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover hover:scale-105 transition-all group"
              >
                <i class="fas fa-cog text-themed-secondary group-hover:scale-110 group-hover:rotate-90 transition-all"></i>
                <span class="quick-action-text text-themed-primary">
                  {{ $t('dashboard.quick_actions.settings') }}
                </span>
              </button>
            </div>
          </Card>

          <!-- Recent Activity Section -->
          <Card
            v-else-if="item.i === 'recent-activity'"
            :title="$t('dashboard.recent_activity.title')"
            :subtitle="$t('dashboard.recent_activity.subtitle')"
            class="h-full overflow-auto flex flex-col"
          >
            <Table
              :columns="activityColumns"
              :data="recentActivity"
              :loading="loadingActivity"
              :pagination="null"
              :selectable="false"
              :sortable="false"
            >
              <template #cell-user="{ value }">
                <div class="flex items-center space-x-3">
                  <img
                    v-if="value.avatar"
                    :src="value.avatar"
                    :alt="value.name"
                    class="w-8 h-8 rounded-full"
                  />
                  <div
                    v-else
                    class="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                  >
                    <span class="text-white text-xs font-semibold">
                      {{ value.name.substring(0, 2).toUpperCase() }}
                    </span>
                  </div>
                  <span class="font-medium text-themed-primary">
                    {{ value.name }}
                  </span>
                </div>
              </template>

              <template #cell-action="{ value }">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {{ value }}
                </span>
              </template>

              <template #cell-timestamp="{ value }">
                <span class="text-sm text-themed-muted">
                  {{ formatDate(value) }}
                </span>
              </template>
            </Table>
          </Card>
        </GridItem>
      </GridLayout>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { GridLayout, GridItem } from 'grid-layout-plus';
import Widget from '@/components/dashboard/Widget.vue';
import Card from '@/components/ui/Card.vue';
import Table from '@/components/ui/Table.vue';
import WelcomeAnimation from '@/components/common/WelcomeAnimation.vue';
import api from '@/utils/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants';

/**
 * Dashboard Index Page
 * Main dashboard with draggable/resizable widgets
 * Features: Stats widgets, quick action cards, activity table, customizable layout
 */

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();

// Welcome animation state
const showWelcome = ref(false);
const contentVisible = ref(false);

// Sidebar state (read from localStorage to match DashboardLayout)
const sidebarCollapsed = ref(false);

// Layout state
const layout = ref([]);
const originalLayout = ref([]); // Store original layout for cancel functionality
const editMode = ref(false);
const layoutLoaded = ref(false);

// State
const loading = ref(true);
const loadingActivity = ref(true);
const stats = ref({
  totalUsers: 0,
  activeUsers: 0,
  totalGroups: 0,
  totalCategories: 0,
  usersTrend: 0,
  activeUsersTrend: 0,
});
const recentActivity = ref([]);

/**
 * Handle welcome animation complete
 */
const onWelcomeComplete = () => {
  showWelcome.value = false;
  // Delay showing content slightly for smooth transition
  setTimeout(() => {
    contentVisible.value = true;
  }, 50);
};

// Computed
const userName = computed(() => authStore.userName);
const can = (permission) => authStore.can(permission);

// Table columns
const activityColumns = computed(() => [
  { key: 'user', label: t('dashboard.recent_activity.columns.user'), sortable: false },
  { key: 'action', label: t('dashboard.recent_activity.columns.action'), sortable: false },
  { key: 'description', label: t('dashboard.recent_activity.columns.description'), sortable: false },
  { key: 'timestamp', label: t('dashboard.recent_activity.columns.time'), sortable: false },
]);

/**
 * Load dashboard layout from API
 */
const loadLayout = async () => {
  try {
    const response = await api.get('/dashboard/layout');
    layout.value = response.data.layout_config;
    // Store original layout for cancel functionality
    originalLayout.value = JSON.parse(JSON.stringify(response.data.layout_config));
    console.log('Layout loaded:', layout.value);
    layoutLoaded.value = true;
  } catch (error) {
    console.error('Failed to load layout:', error);
    // Use default layout
    const defaultLayout = [
      { i: 'stats', x: 0, y: 0, w: 12, h: 4 },
      { i: 'quick-actions', x: 0, y: 4, w: 12, h: 5 },
      { i: 'recent-activity', x: 0, y: 9, w: 12, h: 8 },
    ];
    layout.value = defaultLayout;
    originalLayout.value = JSON.parse(JSON.stringify(defaultLayout));
    console.log('Using default layout:', layout.value);
    layoutLoaded.value = true;
  }
};

/**
 * Save dashboard layout to API
 */
const saveLayout = async () => {
  try {
    await api.put('/dashboard/layout', {
      layout_config: layout.value,
    });
  } catch (error) {
    console.error('Failed to save layout:', error);
  }
};

/**
 * Save changes and exit edit mode
 */
const saveAndExit = async () => {
  await saveLayout();
  // Update original layout with saved changes
  originalLayout.value = JSON.parse(JSON.stringify(layout.value));
  // Navigate back to settings
  await router.push('/settings');
};

/**
 * Cancel edit mode and discard changes
 */
const cancelEdit = async () => {
  // Restore original layout
  layout.value = JSON.parse(JSON.stringify(originalLayout.value));
  // Navigate back to settings
  await router.push('/settings');
};

/**
 * Handle layout updated event
 */
const onLayoutUpdated = () => {
  // Changes are saved when clicking Save button
};

/**
 * Fetch dashboard stats
 */
const fetchStats = async () => {
  try {
    loading.value = true;
    const response = await api.get('/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Fetch recent activity
 */
const fetchActivity = async () => {
  try {
    loadingActivity.value = true;
    const response = await api.get('/dashboard/activity', {
      params: { per_page: 10 },
    });
    recentActivity.value = response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch activity:', error);
  } finally {
    loadingActivity.value = false;
  }
};

/**
 * Format date
 */
const formatDate = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000); // seconds

  if (diff < 60) return t('dashboard.time.just_now');
  if (diff < 3600) {
    const minutes = Math.floor(diff / 60);
    return t('dashboard.time.minutes_ago', { count: minutes });
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return t('dashboard.time.hours_ago', { count: hours });
  }

  return d.toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  // Initialize sidebar state from localStorage
  const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
  sidebarCollapsed.value = stored === '1';

  // Check if welcome message has been shown in this session
  const welcomeShown = sessionStorage.getItem('dashboard_welcome_shown');
  if (!welcomeShown) {
    // First visit in this session - show welcome animation
    showWelcome.value = true;
    sessionStorage.setItem('dashboard_welcome_shown', 'true');
  } else {
    // Already shown - skip animation and show content directly
    contentVisible.value = true;
  }

  // Check if edit mode is requested via query parameter
  if (route.query.edit === 'true') {
    editMode.value = true;
    console.log('Edit mode enabled via query parameter');
  }

  // Listen for sidebar state changes
  const handleStorageChange = (e) => {
    if (e.key === STORAGE_KEYS.SIDEBAR_COLLAPSED) {
      sidebarCollapsed.value = e.newValue === '1';
    }
  };
  window.addEventListener('storage', handleStorageChange);

  // Also listen for changes within the same window
  const handleSidebarToggle = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
    sidebarCollapsed.value = stored === '1';
  };
  window.addEventListener('sidebar-toggle', handleSidebarToggle);

  // Load layout and data
  loadLayout();
  fetchStats();
  fetchActivity();

  // Refresh data every 30 seconds
  const interval = setInterval(() => {
    fetchStats();
    fetchActivity();
  }, 30000);

  // Clean up on unmount
  return () => {
    clearInterval(interval);
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('sidebar-toggle', handleSidebarToggle);
  };
});
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.7s ease-out forwards;
  opacity: 0;
}

.animate-slideDown {
  animation: slideDown 0.5s ease-out forwards;
}

.dashboard-item {
  transition: all 0.3s ease;
  overflow: hidden;
}

.dashboard-item-edit {
  cursor: move;
  transition: all 0.3s ease;
  border: 2px dashed rgba(var(--color-primary-rgb), 0.3);
  border-radius: 8px;
  background: rgba(var(--color-primary-rgb), 0.05);
  overflow: hidden;
}

.dashboard-item-edit:hover {
  border-color: rgba(var(--color-primary-rgb), 0.6);
  background: rgba(var(--color-primary-rgb), 0.1);
}

/* Grid layout styles */
:deep(.vue-grid-layout) {
  transition: height 0.3s ease;
}

:deep(.vue-grid-item) {
  transition: all 0.3s ease;
  overflow: hidden;
}

:deep(.vue-grid-item > *) {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

:deep(.vue-grid-item.vue-grid-placeholder) {
  background: rgba(var(--color-primary-rgb), 0.2);
  border-radius: 8px;
  border: 2px dashed var(--color-primary);
}

:deep(.vue-resizable-handle) {
  opacity: 0;
  transition: opacity 0.3s ease;
}

:deep(.dashboard-item-edit .vue-resizable-handle) {
  opacity: 1;
}

/* Quick Actions adaptive styles */
.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  min-width: 120px;
  min-height: 100px;
  flex: 1 1 auto;
  max-width: 200px;
}

.quick-action-btn i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  flex-shrink: 0;
}

.quick-action-text {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

/* Compact mode for small containers */
@container (max-width: 400px) {
  .quick-action-btn {
    min-width: 80px;
    min-height: 80px;
    padding: 0.75rem;
    flex-direction: row;
    justify-content: flex-start;
    max-width: 100%;
  }

  .quick-action-btn i {
    font-size: 1.5rem;
    margin-bottom: 0;
    margin-right: 0.5rem;
  }

  .quick-action-text {
    font-size: 0.7rem;
    text-align: left;
    -webkit-line-clamp: 1;
  }
}

/* Very compact mode - icon only */
@container (max-width: 250px) {
  .quick-action-btn {
    min-width: 60px;
    min-height: 60px;
    padding: 0.5rem;
    flex-direction: column;
  }

  .quick-action-btn i {
    font-size: 1.25rem;
    margin-right: 0;
    margin-bottom: 0.25rem;
  }

  .quick-action-text {
    font-size: 0.625rem;
    -webkit-line-clamp: 2;
    text-align: center;
  }
}

/* Enable container queries */
.quick-actions-card {
  container-type: inline-size;
  container-name: quick-actions;
}
</style>
