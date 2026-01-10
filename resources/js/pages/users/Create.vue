<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <Button
        @click="router.back()"
        variant="ghost"
        icon="fas fa-arrow-left"
        size="sm"
      />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ $t('users.create.title') }}
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          {{ $t('users.create.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Form Card -->
    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('users.create.basic_info') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="form.name"
              :label="$t('users.form.name')"
              :placeholder="$t('users.form.name_placeholder')"
              :error="errors.name"
              icon="fas fa-user"
              required
            />
            <Input
              v-model="form.username"
              :label="$t('users.form.username')"
              :placeholder="$t('users.form.username_placeholder')"
              :error="errors.username"
              icon="fas fa-at"
              required
            />
            <Input
              v-model="form.email"
              type="email"
              :label="$t('users.form.email')"
              :placeholder="$t('users.form.email_placeholder')"
              :error="errors.email"
              icon="fas fa-envelope"
              required
            />
            <Select
              v-model="form.status"
              :label="$t('users.form.status')"
              :options="statusOptions"
              :error="errors.status"
              required
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('users.create.password') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              v-model="form.password"
              type="password"
              :label="$t('users.form.password')"
              :placeholder="$t('users.form.password_placeholder')"
              :error="errors.password"
              icon="fas fa-lock"
              required
            />
            <Input
              v-model="form.password_confirmation"
              type="password"
              :label="$t('users.form.password_confirmation')"
              :placeholder="$t('users.form.password_confirmation_placeholder')"
              :error="errors.password_confirmation"
              icon="fas fa-lock"
              required
            />
          </div>
        </div>

        <!-- Group & Categories -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('users.create.organization') }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              v-model="form.group_id"
              :label="$t('users.form.group')"
              :options="groupOptions"
              :error="errors.group_id"
            />
            <Select
              v-model="form.category_ids"
              :label="$t('users.form.categories')"
              :options="categoryOptions"
              :error="errors.category_ids"
              multiple
              searchable
            />
          </div>
        </div>

        <!-- Roles -->
        <div v-if="can('roles.assign')">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t('users.create.roles') }}
          </h3>
          <Select
            v-model="form.role_ids"
            :label="$t('users.form.roles')"
            :options="roleOptions"
            :error="errors.role_ids"
            multiple
            searchable
          />
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            @click="router.back()"
            variant="ghost"
            :disabled="loading"
          >
            {{ $t('common.cancel') }}
          </Button>
          <Button
            type="submit"
            variant="primary"
            :loading="loading"
            :disabled="loading"
            icon="fas fa-save"
          >
            {{ $t('common.create') }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const form = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
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

const handleSubmit = async () => {
  try {
    loading.value = true;
    Object.keys(errors).forEach(key => errors[key] = '');

    await api.post(API_ENDPOINTS.USERS.STORE, form);
    router.push({ name: 'hrm.employees.index' });
  } catch (error) {
    if (error.response?.data?.errors) {
      Object.assign(errors, error.response.data.errors);
    }
  } finally {
    loading.value = false;
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

onMounted(() => {
  fetchOptions();
});
</script>
