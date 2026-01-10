<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center space-x-4">
      <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('groups.create.title') }}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('groups.create.subtitle') }}</p>
      </div>
    </div>

    <!-- Form Card -->
    <Card>
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
        <div class="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button @click="router.back()" variant="ghost" :disabled="loading">
            {{ $t('common.cancel') }}
          </Button>
          <Button type="submit" variant="primary" :loading="loading" :disabled="loading" icon="fas fa-save">
            {{ $t('common.create') }}
          </Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/notification';
import { useGroups } from '@/composables/useGroups';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

const router = useRouter();
const notificationStore = useNotificationStore();

// Composable para gestión de grupos
const {
  loading,
  errors,
  createGroup,
} = useGroups();

const form = reactive({
  name: '',
  description: '',
  is_active: true,
});

const handleSubmit = async () => {
  try {
    await createGroup(form);
    notificationStore.success('Group created successfully');
    await router.push('/hrm/masters/groups');
  } catch (error) {
    if (error.response?.status !== 422) {
      notificationStore.error(error.response?.data?.message || 'Failed to create group');
    }
  }
};
</script>
