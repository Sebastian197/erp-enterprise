<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('groups.title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('groups.subtitle') }}</p>
      </div>
      <Button
        v-if="can('groups.create')"
        @click="router.push('/hrm/masters/groups/create')"
        variant="primary"
        icon="fas fa-plus"
      >
        {{ $t('groups.create') }}
      </Button>
    </div>

    <!-- Filters Card -->
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          v-model="filters.search"
          type="search"
          :placeholder="$t('groups.search_placeholder')"
          icon="fas fa-search"
          clearable
          @input="debouncedSearch"
        />
        <Select
          v-model="filters.is_active"
          :options="statusOptions"
          :placeholder="$t('groups.filter_by_status')"
          @change="fetchGroups"
        />
      </div>
    </Card>

    <!-- Groups Table -->
    <Card>
      <Table
        :columns="columns"
        :data="groups"
        :loading="loading"
        :pagination="pagination"
        :selectable="can('groups.delete')"
        @sort="handleSort"
        @page-change="handlePageChange"
        @selection-change="handleSelectionChange"
      >
        <template #cell-name="{ row }">
          <div class="font-medium text-gray-900 dark:text-white">{{ row.name }}</div>
        </template>

        <template #cell-description="{ value }">
          <div class="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
            {{ value || '-' }}
          </div>
        </template>

        <template #cell-is_active="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              value
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            ]"
          >
            <span
              :class="[
                'w-1.5 h-1.5 rounded-full mr-1.5',
                value ? 'bg-green-600' : 'bg-red-600'
              ]"
            ></span>
            {{ value ? $t('common.active') : $t('common.inactive') }}
          </span>
        </template>

        <template #cell-users_count="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ row.users?.length || 0 }}
          </span>
        </template>

        <template #cell-categories_count="{ row }">
          <span class="text-sm text-gray-700 dark:text-gray-300">
            {{ row.categories?.length || 0 }}
          </span>
        </template>

        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(value) }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-end space-x-2">
            <button
              v-if="can('groups.view')"
              @click="router.push(`/hrm/masters/groups/${row.id}`)"
              class="p-2 text-gray-600 hover:text-primary rounded transition-colors dark:text-gray-400 dark:hover:text-primary"
              :title="$t('common.view')"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              v-if="can('groups.update')"
              @click="router.push(`/hrm/masters/groups/${row.id}/edit`)"
              class="p-2 text-gray-600 hover:text-blue-600 rounded transition-colors dark:text-gray-400 dark:hover:text-blue-500"
              :title="$t('common.edit')"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              v-if="can('groups.delete')"
              @click="confirmDelete(row)"
              class="p-2 text-gray-600 hover:text-red-600 rounded transition-colors dark:text-gray-400 dark:hover:text-red-500"
              :title="$t('common.delete')"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Bulk Actions Bar -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="selectedGroups.length > 0"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center space-x-4 z-40"
      >
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('groups.selected', { count: selectedGroups.length }) }}
        </span>
        <div class="flex items-center space-x-2">
          <Button @click="bulkDelete" variant="danger" size="sm" icon="fas fa-trash">
            {{ $t('groups.delete_selected') }}
          </Button>
          <Button @click="selectedGroups = []" variant="ghost" size="sm">
            {{ $t('common.cancel') }}
          </Button>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <Modal v-model:show="showDeleteModal" :title="$t('groups.delete_confirmation.title')" size="sm">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('groups.delete_confirmation.message', { name: groupToDelete?.name }) }}
      </p>
      <template #footer>
        <Button @click="showDeleteModal = false" variant="ghost">
          {{ $t('common.cancel') }}
        </Button>
        <Button @click="deleteGroup" variant="danger" :loading="deleting">
          {{ $t('common.delete') }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { useWebSocket } from '@/composables/useWebSocket';
import Card from '@/components/ui/Card.vue';
import Table from '@/components/ui/Table.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const { listenPrivate, stop } = useWebSocket();

// State
const loading = ref(true);
const deleting = ref(false);
const groups = ref([]);
const pagination = ref(null);
const selectedGroups = ref([]);
const showDeleteModal = ref(false);
const groupToDelete = ref(null);

const filters = reactive({
  search: '',
  is_active: null,
});

// Computed
const can = (permission) => authStore.can(permission);

// Table columns
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'is_active', label: 'Status', sortable: true },
  { key: 'users_count', label: 'Users' },
  { key: 'categories_count', label: 'Categories' },
  { key: 'created_at', label: 'Created', sortable: true },
];

// Filter options
const statusOptions = [
  { value: null, label: 'All Statuses' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

/**
 * Fetch groups
 */
const fetchGroups = async (page = 1) => {
  try {
    loading.value = true;
    const response = await api.get(API_ENDPOINTS.GROUPS.INDEX, {
      params: {
        page,
        search: filters.search,
        is_active: filters.is_active,
      },
    });

    groups.value = response.data.data;

    if (response.data.current_page) {
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      };
    }
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    notificationStore.error('Failed to fetch groups');
  } finally {
    loading.value = false;
  }
};

/**
 * Debounced search (500ms delay)
 */
let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchGroups();
  }, 500);
};

/**
 * Handle sort
 */
const handleSort = ({ key, order }) => {
  console.log('Sort:', key, order);
  // Implement sorting logic if needed
};

/**
 * Handle page change
 */
const handlePageChange = (page) => {
  fetchGroups(page);
};

/**
 * Handle selection change
 */
const handleSelectionChange = (selected) => {
  selectedGroups.value = selected;
};

/**
 * Confirm delete
 */
const confirmDelete = (group) => {
  groupToDelete.value = group;
  showDeleteModal.value = true;
};

/**
 * Delete group
 */
const deleteGroup = async () => {
  try {
    deleting.value = true;
    await api.delete(API_ENDPOINTS.GROUPS.DESTROY(groupToDelete.value.id));
    showDeleteModal.value = false;
    notificationStore.success('Group deleted successfully');
    fetchGroups(pagination.value?.current_page || 1);
  } catch (error) {
    console.error('Failed to delete group:', error);
    const message = error.response?.data?.message || 'Failed to delete group';
    notificationStore.error(message);
  } finally {
    deleting.value = false;
  }
};

/**
 * Bulk delete
 */
const bulkDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedGroups.value.length} groups?`)) {
    return;
  }

  try {
    await Promise.all(
      selectedGroups.value.map((group) =>
        api.delete(API_ENDPOINTS.GROUPS.DESTROY(group.id))
      )
    );
    selectedGroups.value = [];
    notificationStore.success('Groups deleted successfully');
    fetchGroups(pagination.value?.current_page || 1);
  } catch (error) {
    console.error('Failed to bulk delete groups:', error);
    notificationStore.error('Failed to delete groups');
  }
};

/**
 * Format date
 */
const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Setup WebSocket listeners for real-time updates
 */
const setupWebSocketListeners = () => {
  // Listen to admin channel for group events
  listenPrivate('admin', '.group.created', (event) => {
    notificationStore.success(`Group "${event.group.name}" created`);
    fetchGroups(pagination.value?.current_page || 1);
  });

  listenPrivate('admin', '.group.updated', (event) => {
    notificationStore.info(`Group "${event.group.name}" updated`);
    fetchGroups(pagination.value?.current_page || 1);
  });

  listenPrivate('admin', '.group.deleted', (event) => {
    notificationStore.warning(`Group "${event.group.name}" deleted`);
    fetchGroups(pagination.value?.current_page || 1);
  });
};

/**
 * Cleanup WebSocket listeners
 */
const cleanupWebSocketListeners = () => {
  stop('admin', '.group.created');
  stop('admin', '.group.updated');
  stop('admin', '.group.deleted');
};

// Lifecycle
onMounted(() => {
  fetchGroups();
  setupWebSocketListeners();
});

onUnmounted(() => {
  cleanupWebSocketListeners();
});
</script>
