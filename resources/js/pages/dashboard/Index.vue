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

    <div v-if="!showWelcome" class="space-y-6">
    <!-- Stats Widgets with Staggered Animation -->
    <div v-if="contentVisible" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInUp" style="animation-delay: 0.1s">
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

    <!-- Quick Actions with Staggered Animation -->
    <Card
      v-if="contentVisible"
      :title="$t('dashboard.quick_actions.title')"
      class="animate-fadeInUp"
      style="animation-delay: 0.2s"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          v-if="can('users.create')"
          @click="router.push('/users/create')"
          class="flex flex-col items-center justify-center p-6 bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover transition-all group"
        >
          <i class="fas fa-user-plus text-3xl text-primary mb-2 group-hover:scale-110 transition-transform"></i>
          <span class="text-sm font-medium text-themed-primary">
            {{ $t('dashboard.quick_actions.create_user') }}
          </span>
        </button>

        <button
          v-if="can('groups.create')"
          @click="router.push('/groups/create')"
          class="flex flex-col items-center justify-center p-6 bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover transition-all group"
        >
          <i class="fas fa-folder-plus text-3xl text-success mb-2 group-hover:scale-110 transition-transform"></i>
          <span class="text-sm font-medium text-themed-primary">
            {{ $t('dashboard.quick_actions.create_group') }}
          </span>
        </button>

        <button
          v-if="can('categories.create')"
          @click="router.push('/categories/create')"
          class="flex flex-col items-center justify-center p-6 bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover transition-all group"
        >
          <i class="fas fa-tag text-3xl text-warning mb-2 group-hover:scale-110 transition-transform"></i>
          <span class="text-sm font-medium text-themed-primary">
            {{ $t('dashboard.quick_actions.create_category') }}
          </span>
        </button>

        <button
          @click="router.push('/settings')"
          class="flex flex-col items-center justify-center p-6 bg-themed-tertiary rounded-lg border-2 border-dashed border-themed hover:border-themed-hover transition-all group"
        >
          <i class="fas fa-cog text-3xl text-themed-secondary mb-2 group-hover:scale-110 group-hover:rotate-90 transition-all"></i>
          <span class="text-sm font-medium text-themed-primary">
            {{ $t('dashboard.quick_actions.settings') }}
          </span>
        </button>
      </div>
    </Card>

    <!-- Recent Activity with Staggered Animation -->
    <Card
      v-if="contentVisible"
      :title="$t('dashboard.recent_activity.title')"
      :subtitle="$t('dashboard.recent_activity.subtitle')"
      class="animate-fadeInUp"
      style="animation-delay: 0.3s"
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import Widget from '@/components/dashboard/Widget.vue';
import Card from '@/components/ui/Card.vue';
import Table from '@/components/ui/Table.vue';
import WelcomeAnimation from '@/components/common/WelcomeAnimation.vue';
import api from '@/utils/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants';

/**
 * Dashboard Index Page
 * Main dashboard with stats, quick actions, and recent activity
 * Features: Stats widgets, quick action cards, activity table, real-time updates
 */

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

// Welcome animation state
const showWelcome = ref(true);
const contentVisible = ref(false);

// Sidebar state (read from localStorage to match DashboardLayout)
const sidebarCollapsed = ref(false);

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

.animate-fadeInUp {
  animation: fadeInUp 0.7s ease-out forwards;
  opacity: 0;
}
</style>
