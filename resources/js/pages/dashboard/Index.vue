<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div v-motion-slide-visible-once-bottom>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ $t('dashboard.welcome', { name: userName }) }}
      </h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">
        {{ $t('dashboard.subtitle') }}
      </p>
    </div>

    <!-- Stats Widgets -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

    <!-- Quick Actions -->
    <Card
      :title="$t('dashboard.quick_actions.title')"
      v-motion-slide-visible-once-bottom
    >
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          v-if="can('users.create')"
          @click="router.push('/users/create')"
          class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
        >
          <i class="fas fa-user-plus text-3xl text-blue-600 dark:text-blue-400 mb-2 group-hover:scale-110 transition-transform"></i>
          <span class="text-sm font-medium text-blue-900 dark:text-blue-300">
            {{ $t('dashboard.quick_actions.create_user') }}
          </span>
        </button>

        <button
          v-if="can('groups.create')"
          @click="router.push('/groups/create')"
          class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border-2 border-dashed border-green-300 dark:border-green-700 hover:border-green-500 dark:hover:border-green-500 transition-all group"
        >
          <i class="fas fa-folder-plus text-3xl text-green-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform"></i>
          <span class="text-sm font-medium text-green-900 dark:text-green-300">
            {{ $t('dashboard.quick_actions.create_group') }}
          </span>
        </button>

        <button
          v-if="can('categories.create')"
          @click="router.push('/categories/create')"
          class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
        >
          <i class="fas fa-tag text-3xl text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform"></i>
          <span class="text-sm font-medium text-purple-900 dark:text-purple-300">
            {{ $t('dashboard.quick_actions.create_category') }}
          </span>
        </button>

        <button
          @click="router.push('/settings')"
          class="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-500 transition-all group"
        >
          <i class="fas fa-cog text-3xl text-gray-600 dark:text-gray-400 mb-2 group-hover:scale-110 group-hover:rotate-90 transition-all"></i>
          <span class="text-sm font-medium text-gray-900 dark:text-gray-300">
            {{ $t('dashboard.quick_actions.settings') }}
          </span>
        </button>
      </div>
    </Card>

    <!-- Recent Activity -->
    <Card
      :title="$t('dashboard.recent_activity.title')"
      :subtitle="$t('dashboard.recent_activity.subtitle')"
      v-motion-slide-visible-once-bottom
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
            <span class="font-medium text-gray-900 dark:text-white">
              {{ value.name }}
            </span>
          </div>
        </template>

        <template #cell-action="{ value }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            {{ value }}
          </span>
        </template>

        <template #cell-timestamp="{ value }">
          <span class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(value) }}
          </span>
        </template>
      </Table>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Widget from '@/components/dashboard/Widget.vue';
import Card from '@/components/ui/Card.vue';
import Table from '@/components/ui/Table.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Dashboard Index Page
 * Main dashboard with stats, quick actions, and recent activity
 * Features: Stats widgets, quick action cards, activity table, real-time updates
 */

const router = useRouter();
const authStore = useAuthStore();

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

// Computed
const userName = computed(() => authStore.userName);
const can = (permission) => authStore.can(permission);

// Table columns
const activityColumns = [
  { key: 'user', label: 'User', sortable: false },
  { key: 'action', label: 'Action', sortable: false },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'timestamp', label: 'Time', sortable: false },
];

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

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

  return d.toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  fetchStats();
  fetchActivity();

  // Refresh data every 30 seconds
  const interval = setInterval(() => {
    fetchStats();
    fetchActivity();
  }, 30000);

  // Clean up on unmount
  return () => clearInterval(interval);
});
</script>
