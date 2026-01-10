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
import { useUsers } from '@/composables/useUsers';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import Loading from '@/components/ui/Loading.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Composable para gestión de usuarios
const {
  user,
  loading,
  deleting,
  errors,
  groupOptions,
  categoryOptions,
  roleOptions,
  fetchUser: fetchUserApi,
  updateUser,
  deleteUser: deleteUserApi,
  fetchOptions,
} = useUsers();

const loadingUser = ref(true);
const showDeleteModal = ref(false);

const form = reactive({
  name: '',
  username: '',
  email: '',
  status: 'active',
  group_id: null,
  category_ids: [],
  role_ids: [],
});

const can = (permission) => authStore.can(permission);

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

const loadUser = async () => {
  try {
    loadingUser.value = true;
    const data = await fetchUserApi(route.params.id);
    Object.assign(form, {
      name: data.name,
      username: data.username,
      email: data.email,
      status: data.status,
      group_id: data.group?.id,
      category_ids: data.categories?.map(c => c.id) || [],
      role_ids: data.roles?.map(r => r.id) || [],
    });
  } catch (error) {
    console.error('Failed to fetch user:', error);
    await router.push({ name: 'hrm.employees.index' });
  } finally {
    loadingUser.value = false;
  }
};

const handleSubmit = async () => {
  try {
    await updateUser(route.params.id, form);
    await router.push({ name: 'hrm.employees.index' });
  } catch (error) {
    console.error('Failed to update user:', error);
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteUser = async () => {
  try {
    await deleteUserApi(route.params.id);
    await router.push({ name: 'hrm.employees.index' });
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

onMounted(() => {
  loadUser();
  fetchOptions();
});
</script>
