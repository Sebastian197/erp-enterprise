<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="flex items-center space-x-4">
      <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('categories.edit.title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('categories.edit.subtitle') }}</p>
      </div>
    </div>

    <Loading v-if="loadingCategory" type="skeleton" />

    <Card v-else>
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

        <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            v-if="can('categories.delete')"
            @click="confirmDelete"
            variant="danger"
            icon="fas fa-trash"
            :disabled="loading"
          >
            {{ $t('common.delete') }}
          </Button>

          <div class="flex items-center space-x-4">
            <Button @click="router.back()" variant="ghost" :disabled="loading">{{ $t('common.cancel') }}</Button>
            <Button type="submit" variant="primary" :loading="loading" :disabled="loading" icon="fas fa-save">
              {{ $t('common.save') }}
            </Button>
          </div>
        </div>
      </form>
    </Card>

    <Modal v-model:show="showDeleteModal" :title="$t('categories.delete_confirmation.title')" size="sm">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('categories.delete_confirmation.message', { name: category?.name }) }}
      </p>
      <template #footer>
        <Button @click="showDeleteModal = false" variant="ghost">{{ $t('common.cancel') }}</Button>
        <Button @click="deleteCategory" variant="danger" :loading="deleting">{{ $t('common.delete') }}</Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import { useCategories } from '@/composables/useCategories';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import Loading from '@/components/ui/Loading.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Composable para gestión de categorías
const {
  category,
  loading,
  deleting,
  errors,
  groupOptions,
  fetchCategory: fetchCategoryApi,
  updateCategory,
  deleteCategory: deleteCategoryApi,
  fetchGroups,
} = useCategories();

const loadingCategory = ref(true);
const showDeleteModal = ref(false);

const form = reactive({
  group_id: null,
  name: '',
  description: '',
  is_active: true,
});

const can = (permission) => authStore.can(permission);

const loadCategory = async () => {
  try {
    loadingCategory.value = true;
    const data = await fetchCategoryApi(route.params.id);

    Object.assign(form, {
      group_id: data.data.group_id,
      name: data.data.name,
      description: data.data.description || '',
      is_active: data.data.is_active,
    });
  } catch (error) {
    notificationStore.error('Failed to fetch category');
    await router.push('/hrm/masters/categories');
  } finally {
    loadingCategory.value = false;
  }
};

const handleSubmit = async () => {
  try {
    await updateCategory(route.params.id, form);
    notificationStore.success('Category updated successfully');
    await router.push('/hrm/masters/categories');
  } catch (error) {
    if (error.response?.status !== 422) {
      notificationStore.error(error.response?.data?.message || 'Failed to update category');
    }
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteCategory = async () => {
  try {
    await deleteCategoryApi(route.params.id);
    notificationStore.success('Category deleted successfully');
    await router.push('/hrm/masters/categories');
  } catch (error) {
    notificationStore.error(error.response?.data?.message || 'Failed to delete category');
  }
};

onMounted(() => {
  fetchGroups();
  loadCategory();
});
</script>
