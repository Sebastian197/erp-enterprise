<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center space-x-4">
      <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('users.edit.title') }}</h1>
      </div>
    </div>

    <Loading v-if="loadingUser" type="skeleton" />

    <Card v-else>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('users.edit.basic_info') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input v-model="form.name" :label="$t('users.form.name')" :error="errors.name" icon="fas fa-user" required />
            <Input v-model="form.username" :label="$t('users.form.username')" :error="errors.username" icon="fas fa-at" required />
            <Input v-model="form.email" type="email" :label="$t('users.form.email')" :error="errors.email" icon="fas fa-envelope" required />
            <Select v-model="form.status" :label="$t('users.form.status')" :options="statusOptions" :error="errors.status" required />
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('users.edit.organization') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select v-model="form.group_id" :label="$t('users.form.group')" :options="groupOptions" :error="errors.group_id" />
            <Select v-model="form.category_ids" :label="$t('users.form.categories')" :options="categoryOptions" :error="errors.category_ids" multiple searchable />
          </div>
        </div>

        <div v-if="can('roles.assign')">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('users.edit.roles') }}</h3>
          <Select v-model="form.role_ids" :label="$t('users.form.roles')" :options="roleOptions" :error="errors.role_ids" multiple searchable />
        </div>

        <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button v-if="can('users.delete')" @click="confirmDelete" variant="danger" icon="fas fa-trash">{{ $t('common.delete') }}</Button>
          <div class="flex items-center space-x-4">
            <Button @click="router.back()" variant="ghost" :disabled="loading">{{ $t('common.cancel') }}</Button>
            <Button type="submit" variant="primary" :loading="loading" :disabled="loading" icon="fas fa-save">{{ $t('common.save') }}</Button>
          </div>
        </div>
      </form>
    </Card>

    <Modal v-model:show="showDeleteModal" :title="$t('users.delete_confirmation.title')" size="sm">
      <p class="text-gray-600 dark:text-gray-400">{{ $t('users.delete_confirmation.message', { name: user?.name }) }}</p>
      <template #footer>
        <Button @click="showDeleteModal = false" variant="ghost">{{ $t('common.cancel') }}</Button>
        <Button @click="deleteUser" variant="danger" :loading="deleting">{{ $t('common.delete') }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import Loading from '@/components/ui/Loading.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const loadingUser = ref(true);
const deleting = ref(false);
const showDeleteModal = ref(false);
const user = ref(null);

const form = reactive({
  name: '',
  username: '',
  email: '',
  status: 'active',
  group_id: null,
  category_ids: [],
  role_ids: [],
});

const errors = reactive({});
const can = (permission) => authStore.can(permission);

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const groupOptions = ref([]);
const categoryOptions = ref([]);
const roleOptions = ref([]);

const fetchUser = async () => {
  try {
    loadingUser.value = true;
    const response = await api.get(API_ENDPOINTS.USERS.SHOW(route.params.id));
    user.value = response.data;
    Object.assign(form, {
      name: response.data.name,
      username: response.data.username,
      email: response.data.email,
      status: response.data.status,
      group_id: response.data.group?.id,
      category_ids: response.data.categories?.map(c => c.id) || [],
      role_ids: response.data.roles?.map(r => r.id) || [],
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    router.push('/users');
  } finally {
    loadingUser.value = false;
  }
};

const fetchOptions = async () => {
  try {
    const [groups, categories, roles] = await Promise.all([
      api.get(API_ENDPOINTS.GROUPS.INDEX),
      api.get(API_ENDPOINTS.CATEGORIES.INDEX),
      api.get(API_ENDPOINTS.ROLES.INDEX),
    ]);
    groupOptions.value = groups.data.data.map(g => ({ value: g.id, label: g.name }));
    categoryOptions.value = categories.data.data.map(c => ({ value: c.id, label: c.name }));
    roleOptions.value = roles.data.data.map(r => ({ value: r.id, label: r.name }));
  } catch (error) {
    console.error('Failed to fetch options:', error);
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    Object.keys(errors).forEach(key => errors[key] = '');
    await api.put(API_ENDPOINTS.USERS.UPDATE(route.params.id), form);
    router.push('/users');
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    }
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteUser = async () => {
  try {
    deleting.value = true;
    await api.delete(API_ENDPOINTS.USERS.DESTROY(route.params.id));
    router.push('/users');
  } catch (error) {
    console.error('Failed to delete user:', error);
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchUser();
  fetchOptions();
});
</script>
