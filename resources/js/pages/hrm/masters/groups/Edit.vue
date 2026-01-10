<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('groups.edit.title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('groups.edit.subtitle') }}</p>
      </div>
    </div>

    <Loading v-if="loadingGroup" type="skeleton" />

    <!-- Form Card -->
    <Card v-else>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Information -->
        <div>
          <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            {{ $t('groups.form.basic_info') }}
          </h3>
          <div class="grid grid-cols-1 gap-4">
            <Input
              v-model="form.name"
              :label="$t('groups.form.name')"
              :placeholder="$t('groups.form.name_placeholder')"
              :error="errors.name"
              icon="fas fa-layer-group"
              required
            />

            <Input
              v-model="form.description"
              :label="$t('groups.form.description')"
              :placeholder="$t('groups.form.description_placeholder')"
              :error="errors.description"
              type="textarea"
              rows="4"
            />

            <div class="flex items-center">
              <input
                v-model="form.is_active"
                type="checkbox"
                id="is_active"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label for="is_active" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                {{ $t('groups.form.is_active') }}
              </label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            v-if="can('groups.delete')"
            @click="confirmDelete"
            variant="danger"
            icon="fas fa-trash"
            :disabled="loading"
          >
            {{ $t('common.delete') }}
          </Button>

          <div class="flex items-center space-x-4">
            <Button @click="router.back()" variant="ghost" :disabled="loading">
              {{ $t('common.cancel') }}
            </Button>
            <Button type="submit" variant="primary" :loading="loading" :disabled="loading" icon="fas fa-save">
              {{ $t('common.save') }}
            </Button>
          </div>
        </div>
      </form>
    </Card>

    <!-- Delete Confirmation Modal -->
    <Modal v-model:show="showDeleteModal" :title="$t('groups.delete_confirmation.title')" size="sm">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('groups.delete_confirmation.message', { name: group?.name }) }}
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
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';
import Modal from '@/components/ui/Modal.vue';
import Loading from '@/components/ui/Loading.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const loading = ref(false);
const loadingGroup = ref(true);
const deleting = ref(false);
const showDeleteModal = ref(false);
const group = ref(null);

const form = reactive({
  name: '',
  description: '',
  is_active: true,
});

const errors = reactive({});

const can = (permission) => authStore.can(permission);

const fetchGroup = async () => {
  try {
    loadingGroup.value = true;
    const response = await api.get(API_ENDPOINTS.GROUPS.SHOW(route.params.id));
    group.value = response.data.data;

    // Populate form
    Object.assign(form, {
      name: response.data.data.name,
      description: response.data.data.description || '',
      is_active: response.data.data.is_active,
    });
  } catch (error) {
    console.error('Failed to fetch group:', error);
    notificationStore.error('Failed to fetch group');
    router.push('/hrm/masters/groups');
  } finally {
    loadingGroup.value = false;
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;

    // Clear previous errors
    Object.keys(errors).forEach(key => delete errors[key]);

    await api.put(API_ENDPOINTS.GROUPS.UPDATE(route.params.id), form);

    notificationStore.success('Group updated successfully');
    router.push('/hrm/masters/groups');
  } catch (error) {
    if (error.response?.status === 422) {
      // Validation errors
      Object.assign(errors, error.response.data.errors);
    } else {
      notificationStore.error(error.response?.data?.message || 'Failed to update group');
    }
  } finally {
    loading.value = false;
  }
};

const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteGroup = async () => {
  try {
    deleting.value = true;
    await api.delete(API_ENDPOINTS.GROUPS.DESTROY(route.params.id));
    notificationStore.success('Group deleted successfully');
    router.push('/hrm/masters/groups');
  } catch (error) {
    console.error('Failed to delete group:', error);
    notificationStore.error(error.response?.data?.message || 'Failed to delete group');
  } finally {
    deleting.value = false;
  }
};

onMounted(() => {
  fetchGroup();
});
</script>
