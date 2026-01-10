<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('categories.title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('categories.subtitle') }}</p>
      </div>
      <Button
        v-if="can('categories.create')"
        @click="router.push('/hrm/masters/categories/create')"
        variant="primary"
        icon="fas fa-plus"
      >
        {{ $t('categories.create') }}
      </Button>
    </div>

    <!-- Filters Card -->
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          v-model="filters.search"
          type="search"
          :placeholder="$t('categories.search_placeholder')"
          icon="fas fa-search"
          clearable
          @input="debouncedSearch"
        />
        <Select
          v-model="filters.group_id"
          :options="groupOptions"
          :placeholder="$t('categories.filter_by_group')"
          @change="fetchCategories"
        />
        <Select
          v-model="filters.is_active"
          :options="statusOptions"
          :placeholder="$t('categories.filter_by_status')"
          @change="fetchCategories"
        />
      </div>
    </Card>

    <!-- Categories Table -->
    <Card>
      <Table
        :columns="columns"
        :data="categories"
        :loading="loading"
        :pagination="pagination"
        :selectable="can('categories.delete')"
        @sort="handleSort"
        @page-change="handlePageChange"
        @selection-change="handleSelectionChange"
      >
        <template #cell-name="{ row }">
          <div class="font-medium text-gray-900 dark:text-white">{{ row.name }}</div>
        </template>

        <template #cell-group="{ row }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {{ row.group?.name || '-' }}
          </span>
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

        <template #cell-created_at="{ value }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(value) }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-end space-x-2">
            <button
              v-if="can('categories.view')"
              @click="router.push(`/hrm/masters/categories/${row.id}`)"
              class="p-2 text-gray-600 hover:text-primary rounded transition-colors dark:text-gray-400"
              :title="$t('common.view')"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              v-if="can('categories.update')"
              @click="router.push(`/hrm/masters/categories/${row.id}/edit`)"
              class="p-2 text-gray-600 hover:text-blue-600 rounded transition-colors dark:text-gray-400"
              :title="$t('common.edit')"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              v-if="can('categories.delete')"
              @click="confirmDelete(row)"
              class="p-2 text-gray-600 hover:text-red-600 rounded transition-colors dark:text-gray-400"
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
        v-if="selectedCategories.length > 0"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center space-x-4 z-40"
      >
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ selectedCategories.length }} selected
        </span>
        <div class="flex items-center space-x-2">
          <Button @click="bulkDelete" variant="danger" size="sm" icon="fas fa-trash">
            Delete selected
          </Button>
          <Button @click="selectedCategories = []" variant="ghost" size="sm">
            Cancel
          </Button>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <Modal v-model:show="showDeleteModal" :title="$t('categories.delete_confirmation.title')" size="sm">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('categories.delete_confirmation.message', { name: categoryToDelete?.name }) }}
      </p>
      <template #footer>
        <Button @click="showDeleteModal = false" variant="ghost">Cancel</Button>
        <Button @click="deleteCategory" variant="danger" :loading="deleting">Delete</Button>
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

const loading = ref(true);
const deleting = ref(false);
const categories = ref([]);
const pagination = ref(null);
const selectedCategories = ref([]);
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);

const filters = reactive({
  search: '',
  group_id: null,
  is_active: null,
});

const can = (permission) => authStore.can(permission);

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'group', label: 'Group', sortable: false },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'is_active', label: 'Status', sortable: true },
  { key: 'users_count', label: 'Users' },
  { key: 'created_at', label: 'Created', sortable: true },
];

const groupOptions = ref([{ value: null, label: 'All Groups' }]);

const statusOptions = [
  { value: null, label: 'All Statuses' },
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const fetchCategories = async (page = 1) => {
  try {
    loading.value = true;
    const response = await api.get(API_ENDPOINTS.CATEGORIES.INDEX, {
      params: {
        page,
        search: filters.search,
        group_id: filters.group_id,
        is_active: filters.is_active,
      },
    });

    categories.value = response.data.data;

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
    console.error('Failed to fetch categories:', error);
    notificationStore.error('Failed to fetch categories');
  } finally {
    loading.value = false;
  }
};

const fetchGroups = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GROUPS.INDEX);
    groupOptions.value = [
      { value: null, label: 'All Groups' },
      ...response.data.data.map(g => ({ value: g.id, label: g.name })),
    ];
  } catch (error) {
    console.error('Failed to fetch groups:', error);
  }
};

let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchCategories();
  }, 500);
};

const handleSort = ({ key, order }) => {
  console.log('Sort:', key, order);
};

const handlePageChange = (page) => {
  fetchCategories(page);
};

const handleSelectionChange = (selected) => {
  selectedCategories.value = selected;
};

const confirmDelete = (category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

const deleteCategory = async () => {
  try {
    deleting.value = true;
    await api.delete(API_ENDPOINTS.CATEGORIES.DESTROY(categoryToDelete.value.id));
    showDeleteModal.value = false;
    notificationStore.success('Category deleted successfully');
    fetchCategories(pagination.value?.current_page || 1);
  } catch (error) {
    console.error('Failed to delete category:', error);
    notificationStore.error(error.response?.data?.message || 'Failed to delete category');
  } finally {
    deleting.value = false;
  }
};

const bulkDelete = async () => {
  if (!confirm(`Are you sure you want to delete ${selectedCategories.value.length} categories?`)) {
    return;
  }

  try {
    await Promise.all(
      selectedCategories.value.map((category) =>
        api.delete(API_ENDPOINTS.CATEGORIES.DESTROY(category.id))
      )
    );
    selectedCategories.value = [];
    notificationStore.success('Categories deleted successfully');
    fetchCategories(pagination.value?.current_page || 1);
  } catch (error) {
    console.error('Failed to bulk delete categories:', error);
    notificationStore.error('Failed to delete categories');
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const setupWebSocketListeners = () => {
  listenPrivate('admin', '.category.created', (event) => {
    notificationStore.success(`Category "${event.category.name}" created`);
    fetchCategories(pagination.value?.current_page || 1);
  });

  listenPrivate('admin', '.category.updated', (event) => {
    notificationStore.info(`Category "${event.category.name}" updated`);
    fetchCategories(pagination.value?.current_page || 1);
  });

  listenPrivate('admin', '.category.deleted', (event) => {
    notificationStore.warning(`Category "${event.category.name}" deleted`);
    fetchCategories(pagination.value?.current_page || 1);
  });
};

const cleanupWebSocketListeners = () => {
  stop('admin', '.category.created');
  stop('admin', '.category.updated');
  stop('admin', '.category.deleted');
};

onMounted(() => {
  fetchCategories();
  fetchGroups();
  setupWebSocketListeners();
});

onUnmounted(() => {
  cleanupWebSocketListeners();
});
</script>
