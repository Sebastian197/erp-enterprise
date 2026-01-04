<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('users.title') }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ $t('users.subtitle') }}
        </p>
      </div>

      <Button
        v-if="can('users.create')"
        @click="router.push('/users/create')"
        variant="primary"
        icon="fas fa-plus"
      >
        {{ $t('users.create_user') }}
      </Button>
    </div>

    <!-- Filters Card -->
    <Card>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <Input
            v-model="filters.search"
            type="search"
            :placeholder="$t('users.search_placeholder')"
            icon="fas fa-search"
            clearable
            @input="debouncedSearch"
          />
        </div>

        <!-- Group Filter -->
        <Select
          v-model="filters.group"
          :options="groupOptions"
          :placeholder="$t('users.filter_by_group')"
          @change="fetchUsers"
        />

        <!-- Status Filter -->
        <Select
          v-model="filters.status"
          :options="statusOptions"
          :placeholder="$t('users.filter_by_status')"
          @change="fetchUsers"
        />
      </div>
    </Card>

    <!-- Users Table -->
    <Card>
      <Table
        :columns="columns"
        :data="users"
        :loading="loading"
        :pagination="pagination"
        :selectable="can('users.delete')"
        @sort="handleSort"
        @page-change="handlePageChange"
        @selection-change="handleSelectionChange"
      >
        <template #cell-name="{ row }">
          <div class="flex items-center space-x-3">
            <img
              v-if="row.avatar"
              :src="row.avatar"
              :alt="row.name"
              class="w-10 h-10 rounded-full object-cover"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
            >
              <span class="text-white font-semibold">
                {{ row.name.substring(0, 2).toUpperCase() }}
              </span>
            </div>
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ row.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ row.username }}</p>
            </div>
          </div>
        </template>

        <template #cell-email="{ row }">
          <a
            :href="`mailto:${row.email}`"
            class="text-primary hover:text-primary-dark transition-colors"
          >
            {{ row.email }}
          </a>
        </template>

        <template #cell-group="{ value }">
          <span
            v-if="value"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          >
            {{ value.name }}
          </span>
          <span v-else class="text-gray-400">-</span>
        </template>

        <template #cell-status="{ value }">
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              value === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            ]"
          >
            <span
              :class="[
                'w-1.5 h-1.5 rounded-full mr-1.5',
                value === 'active' ? 'bg-green-600' : 'bg-red-600',
              ]"
            ></span>
            {{ $t(`users.status.${value}`) }}
          </span>
        </template>

        <template #actions="{ row }">
          <div class="flex items-center justify-end space-x-2">
            <button
              v-if="can('users.view')"
              @click="router.push(`/users/${row.id}`)"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              :title="$t('users.view')"
            >
              <i class="fas fa-eye"></i>
            </button>
            <button
              v-if="can('users.update')"
              @click="router.push(`/users/${row.id}/edit`)"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              :title="$t('users.edit')"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
              v-if="can('users.delete')"
              @click="confirmDelete(row)"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              :title="$t('users.delete')"
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </template>
      </Table>
    </Card>

    <!-- Bulk Actions (when items selected) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div
        v-if="selectedUsers.length > 0"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center space-x-4 z-40"
      >
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('users.selected', { count: selectedUsers.length }) }}
        </span>
        <div class="flex items-center space-x-2">
          <Button
            @click="bulkDelete"
            variant="danger"
            size="sm"
            icon="fas fa-trash"
          >
            {{ $t('users.delete_selected') }}
          </Button>
          <Button
            @click="selectedUsers = []"
            variant="ghost"
            size="sm"
          >
            {{ $t('common.cancel') }}
          </Button>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model:show="showDeleteModal"
      :title="$t('users.delete_confirmation.title')"
      size="sm"
    >
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('users.delete_confirmation.message', { name: userToDelete?.name }) }}
      </p>

      <template #footer>
        <Button
          @click="showDeleteModal = false"
          variant="ghost"
        >
          {{ $t('common.cancel') }}
        </Button>
        <Button
          @click="deleteUser"
          variant="danger"
          :loading="deleting"
        >
          {{ $t('common.delete') }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/ui/Card.vue';
import Table from '@/components/ui/Table.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Users Index Page
 * User list with search, filters, sorting, and pagination
 * Features: CRUD operations, bulk actions, real-time search
 */

const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(true);
const deleting = ref(false);
const users = ref([]);
const pagination = ref(null);
const selectedUsers = ref([]);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const filters = reactive({
  search: '',
  group: null,
  status: null,
});

// Computed
const can = (permission) => authStore.can(permission);

// Table columns
const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'group', label: 'Group', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created_at', label: 'Created', sortable: true },
];

// Filter options
const groupOptions = ref([
  { value: null, label: 'All Groups' },
]);

const statusOptions = [
  { value: null, label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

/**
 * Fetch users
 */
const fetchUsers = async (page = 1) => {
  try {
    loading.value = true;
    const response = await api.get(API_ENDPOINTS.USERS.INDEX, {
      params: {
        page,
        search: filters.search,
        group: filters.group,
        status: filters.status,
      },
    });

    users.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      per_page: response.data.per_page,
      total: response.data.total,
      from: response.data.from,
      to: response.data.to,
    };
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    loading.value = false;
  }
};

/**
 * Debounced search
 */
let searchTimeout;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers();
  }, 500);
};

/**
 * Handle sort
 */
const handleSort = ({ key, order }) => {
  console.log('Sort:', key, order);
  // Implement sorting logic
};

/**
 * Handle page change
 */
const handlePageChange = (page) => {
  fetchUsers(page);
};

/**
 * Handle selection change
 */
const handleSelectionChange = (selected) => {
  selectedUsers.value = selected;
};

/**
 * Confirm delete
 */
const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

/**
 * Delete user
 */
const deleteUser = async () => {
  try {
    deleting.value = true;
    await api.delete(API_ENDPOINTS.USERS.DESTROY(userToDelete.value.id));
    showDeleteModal.value = false;
    fetchUsers(pagination.value.current_page);
  } catch (error) {
    console.error('Failed to delete user:', error);
  } finally {
    deleting.value = false;
  }
};

/**
 * Bulk delete
 */
const bulkDelete = async () => {
  if (!confirm('Are you sure you want to delete selected users?')) return;

  try {
    await Promise.all(
      selectedUsers.value.map(user =>
        api.delete(API_ENDPOINTS.USERS.DESTROY(user.id))
      )
    );
    selectedUsers.value = [];
    fetchUsers(pagination.value.current_page);
  } catch (error) {
    console.error('Failed to bulk delete users:', error);
  }
};

/**
 * Fetch groups for filter
 */
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

// Lifecycle
onMounted(() => {
  fetchUsers();
  fetchGroups();
});
</script>
