<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center space-x-4">
      <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('categories.create.title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('categories.create.subtitle') }}</p>
      </div>
    </div>

    <Card>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{{ $t('categories.form.basic_info') }}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              v-model="form.group_id"
              :label="$t('categories.form.group')"
              :options="groupOptions"
              :error="errors.group_id"
              required
            />

            <Input
              v-model="form.name"
              :label="$t('categories.form.name')"
              :placeholder="$t('categories.form.name_placeholder')"
              :error="errors.name"
              icon="fas fa-tag"
              required
            />
          </div>

          <div class="mt-4">
            <Input
              v-model="form.description"
              :label="$t('categories.form.description')"
              :placeholder="$t('categories.form.description_placeholder')"
              :error="errors.description"
              type="textarea"
              rows="4"
            />
          </div>

          <div class="flex items-center mt-4">
            <input
              v-model="form.is_active"
              type="checkbox"
              id="is_active"
              class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label for="is_active" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {{ $t('categories.form.is_active') }}
            </label>
          </div>
        </div>

        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button @click="router.back()" variant="ghost" :disabled="loading">{{ $t('common.cancel') }}</Button>
          <Button type="submit" variant="primary" :loading="loading" :disabled="loading" icon="fas fa-save">
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
import { useNotificationStore } from '@/stores/notification';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const router = useRouter();
const notificationStore = useNotificationStore();

const loading = ref(false);
const groupOptions = ref([]);

const form = reactive({
  group_id: null,
  name: '',
  description: '',
  is_active: true,
});

const errors = reactive({});

const fetchGroups = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.GROUPS.INDEX);
    groupOptions.value = response.data.data.map(g => ({ value: g.id, label: g.name }));
  } catch (error) {
    console.error('Failed to fetch groups:', error);
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    Object.keys(errors).forEach(key => delete errors[key]);

    await api.post(API_ENDPOINTS.CATEGORIES.STORE, form);

    notificationStore.success('Category created successfully');
    router.push('/hrm/masters/categories');
  } catch (error) {
    if (error.response?.status === 422) {
      Object.assign(errors, error.response.data.errors);
    } else {
      notificationStore.error(error.response?.data?.message || 'Failed to create category');
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGroups();
});
</script>
