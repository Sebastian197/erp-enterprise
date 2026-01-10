<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('groups.show.title') }}</h1>
      </div>
      <Button
        v-if="can('groups.update') && group"
        @click="router.push(`/hrm/masters/groups/${group.id}/edit`)"
        variant="primary"
        icon="fas fa-edit"
      >
        {{ $t('common.edit') }}
      </Button>
    </div>

    <Loading v-if="loading" type="skeleton" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info Card -->
      <Card class="lg:col-span-1">
        <div class="text-center">
          <div class="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-layer-group text-primary text-3xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ group.name }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mt-2">{{ group.description || '-' }}</p>

          <span
            :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4',
              group.is_active
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            ]"
          >
            <span
              :class="[
                'w-2 h-2 rounded-full mr-2',
                group.is_active ? 'bg-green-600' : 'bg-red-600'
              ]"
            ></span>
            {{ group.is_active ? $t('common.active') : $t('common.inactive') }}
          </span>
        </div>

        <div class="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('groups.show.users_count') }}</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ group.users?.length || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('groups.show.categories_count') }}</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ group.categories?.length || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('groups.show.created_at') }}</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(group.created_at) }}</p>
          </div>
        </div>
      </Card>

      <!-- Details Cards -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Users Card -->
        <Card :title="$t('groups.show.users')">
          <div v-if="group.users && group.users.length > 0" class="space-y-2">
            <div
              v-for="user in group.users"
              :key="user.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div v-if="user.avatar" class="w-10 h-10 rounded-full overflow-hidden">
                  <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
                </div>
                <div v-else class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span class="text-primary font-semibold text-sm">
                    {{ user.name.substring(0, 2).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ user.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.username }}</p>
                </div>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  user.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                ]"
              >
                {{ user.status }}
              </span>
            </div>
          </div>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center py-8">
            {{ $t('groups.show.no_users') }}
          </p>
        </Card>

        <!-- Categories Card -->
        <Card :title="$t('groups.show.categories')">
          <div v-if="group.categories && group.categories.length > 0" class="space-y-2">
            <div
              v-for="category in group.categories"
              :key="category.id"
              class="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div>
                <p class="font-medium text-gray-900 dark:text-white">{{ category.name }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ category.description || '-' }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 rounded text-xs font-medium',
                  category.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                ]"
              >
                {{ category.is_active ? $t('common.active') : $t('common.inactive') }}
              </span>
            </div>
          </div>
          <p v-else class="text-gray-500 dark:text-gray-400 text-center py-8">
            {{ $t('groups.show.no_categories') }}
          </p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Loading from '@/components/ui/Loading.vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const loading = ref(true);
const group = ref({});

const can = (permission) => authStore.can(permission);

const fetchGroup = async () => {
  try {
    loading.value = true;
    const response = await api.get(API_ENDPOINTS.GROUPS.SHOW(route.params.id));
    group.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch group:', error);
    notificationStore.error('Failed to fetch group');
    router.push('/hrm/masters/groups');
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  fetchGroup();
});
</script>
