<template>
  <div class="relative" ref="dropdownRef">
    <!-- Trigger Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      :aria-label="$t('notifications.label')"
      aria-haspopup="true"
      :aria-expanded="isOpen"
    >
      <i class="fas fa-bell"></i>
      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ $t('notifications.title') }}
          </h3>
          <div class="flex items-center space-x-2">
            <!-- Mark All Read Button -->
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-primary hover:text-primary-dark transition-colors"
              :title="$t('notifications.mark_all_read')"
            >
              <i class="fas fa-check-double"></i>
            </button>
            <!-- Settings Button -->
            <button
              @click="goToNotifications"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              :title="$t('notifications.view_all')"
            >
              <i class="fas fa-cog text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <!-- Loading State -->
          <div v-if="loading" class="p-4 space-y-3">
            <div
              v-for="i in 3"
              :key="`skeleton-${i}`"
              class="flex space-x-3 animate-pulse"
            >
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div class="flex-1 space-y-2">
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div v-else-if="notifications.length > 0" class="divide-y divide-gray-200 dark:divide-gray-700">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              :class="[
                'flex items-start space-x-3 p-4 transition-colors cursor-pointer',
                notification.read_at
                  ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  : 'bg-primary/5 hover:bg-primary/10',
              ]"
              @click="handleNotificationClick(notification)"
            >
              <!-- Icon -->
              <div
                :class="[
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  getNotificationColorClass(notification.type),
                ]"
              >
                <i :class="getNotificationIcon(notification.type)"></i>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-sm',
                    notification.read_at
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-900 dark:text-white font-medium',
                  ]"
                >
                  {{ notification.data.title }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {{ notification.data.message }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{ formatTime(notification.created_at) }}
                </p>
              </div>

              <!-- Unread Indicator -->
              <div
                v-if="!notification.read_at"
                class="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"
              ></div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-12 px-4">
            <i class="fas fa-bell-slash text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
            <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
              {{ $t('notifications.no_notifications') }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div
          v-if="notifications.length > 0"
          class="border-t border-gray-200 dark:border-gray-700"
        >
          <button
            @click="goToNotifications"
            class="w-full py-3 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {{ $t('notifications.view_all') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * NotificationDropdown Component
 * Displays user notifications with real-time updates
 * Features: Unread count badge, mark as read, WebSocket integration
 */

const router = useRouter();
const { t } = useI18n();

// State
const isOpen = ref(false);
const loading = ref(false);
const notifications = ref([]);
const dropdownRef = ref(null);

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read_at).length;
});

/**
 * Toggle dropdown
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && notifications.value.length === 0) {
    fetchNotifications();
  }
};

/**
 * Fetch notifications
 */
const fetchNotifications = async () => {
  try {
    loading.value = true;
    const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.INDEX, {
      params: { per_page: 10 },
    });
    notifications.value = response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Handle notification click
 */
const handleNotificationClick = async (notification) => {
  // Mark as read if not already read
  if (!notification.read_at) {
    await markAsRead(notification.id);
  }

  // Navigate to notification link if available
  if (notification.data.link) {
    await router.push(notification.data.link);
    isOpen.value = false;
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (id) => {
  try {
    await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));

    // Update local state
    const notification = notifications.value.find(n => n.id === id);
    if (notification) {
      notification.read_at = new Date().toISOString();
    }
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async () => {
  try {
    await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);

    // Update local state
    notifications.value.forEach(n => {
      n.read_at = new Date().toISOString();
    });
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};

/**
 * Navigate to notifications page
 */
const goToNotifications = async () => {
  await router.push('/notifications');
  isOpen.value = false;
};

/**
 * Get notification icon based on type
 */
const getNotificationIcon = (type) => {
  const iconMap = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-times-circle',
    message: 'fas fa-envelope',
    user: 'fas fa-user',
    system: 'fas fa-server',
  };
  return iconMap[type] || 'fas fa-bell';
};

/**
 * Get notification color class based on type
 */
const getNotificationColorClass = (type) => {
  const colorMap = {
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
    error: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    message: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    user: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    system: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };
  return colorMap[type] || colorMap.info;
};

/**
 * Format time ago
 */
const formatTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = Math.floor((now - time) / 1000); // seconds

  if (diff < 60) return t('notifications.time.just_now');
  if (diff < 3600) return t('notifications.time.minutes_ago', { count: Math.floor(diff / 60) });
  if (diff < 86400) return t('notifications.time.hours_ago', { count: Math.floor(diff / 3600) });
  if (diff < 604800) return t('notifications.time.days_ago', { count: Math.floor(diff / 86400) });

  return time.toLocaleDateString();
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
  // Fetch initial notifications
  fetchNotifications();

  // Poll for new notifications every 30 seconds
  const pollInterval = setInterval(fetchNotifications, 30000);

  // Clean up on unmount
  onUnmounted(() => {
    clearInterval(pollInterval);
  });
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
