<template>
  <div class="max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <Button @click="router.back()" variant="ghost" icon="fas fa-arrow-left" size="sm" />
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('users.show.title') }}</h1>
      </div>
      <Button v-if="can('users.update')" @click="async () => await router.push({ name: 'hrm.employees.edit', params: { id: user?.id } })" variant="primary" icon="fas fa-edit">{{ $t('common.edit') }}</Button>
    </div>

    <Loading v-if="loading" type="skeleton" />

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- User Info Card -->
      <Card class="lg:col-span-1">
        <div class="text-center">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
          <div v-else class="w-32 h-32 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span class="text-white text-4xl font-bold">{{ user.name.substring(0, 2).toUpperCase() }}</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user.name }}</h2>
          <p class="text-gray-600 dark:text-gray-400">@{{ user.username }}</p>
          <span :class="['inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4', user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400']">
            <span :class="['w-2 h-2 rounded-full mr-2', user.status === 'active' ? 'bg-green-600' : 'bg-red-600']"></span>
            {{ $t(`users.status.${user.status}`) }}
          </span>
        </div>

        <div class="mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('users.show.group') }}</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ user.group?.name || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('users.show.created_at') }}</p>
            <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </Card>

      <!-- Details Cards -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Contact Information -->
        <Card :title="$t('users.show.contact_info')">
          <div class="space-y-4">
            <div v-for="email in user.emails" :key="email.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-envelope text-gray-400"></i>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ email.email }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ email.type }}</p>
                </div>
              </div>
              <span v-if="email.is_primary" class="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">{{ $t('users.show.primary') }}</span>
            </div>
            <div v-for="phone in user.phones" :key="phone.id" class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <i class="fas fa-phone text-gray-400"></i>
                <div>
                  <p class="font-medium text-gray-900 dark:text-white">{{ phone.phone }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ phone.type }}</p>
                </div>
              </div>
              <span v-if="phone.is_primary" class="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">{{ $t('users.show.primary') }}</span>
            </div>
          </div>
        </Card>

        <!-- Categories -->
        <Card :title="$t('users.show.categories')">
          <div class="flex flex-wrap gap-2">
            <span v-for="category in user.categories" :key="category.id" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              {{ category.name }}
            </span>
            <span v-if="!user.categories?.length" class="text-gray-500 dark:text-gray-400">{{ $t('users.show.no_categories') }}</span>
          </div>
        </Card>

        <!-- Roles & Permissions -->
        <Card :title="$t('users.show.roles_permissions')">
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('users.show.roles') }}</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="role in user.roles" :key="role.id" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400">
                  {{ role.name }}
                </span>
                <span v-if="!user.roles?.length" class="text-gray-500 dark:text-gray-400">{{ $t('users.show.no_roles') }}</span>
              </div>
            </div>
            <div>
              <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ $t('users.show.permissions') }}</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="permission in user.permissions" :key="permission.id" class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                  {{ permission.name }}
                </span>
                <span v-if="!user.permissions?.length" class="text-gray-500 dark:text-gray-400">{{ $t('users.show.no_permissions') }}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUsers } from '@/composables/useUsers';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Loading from '@/components/ui/Loading.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Composable para gestión de usuarios
const {
  user,
  loading,
  fetchUser: fetchUserApi,
} = useUsers();

const can = (permission) => authStore.can(permission);

const loadUser = async () => {
  try {
    await fetchUserApi(route.params.id);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    await router.push({ name: 'hrm.employees.index' });
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(() => {
  loadUser();
});
</script>
