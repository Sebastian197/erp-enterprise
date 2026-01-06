<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-themed-primary">
        {{ $t('menu.settings') }}
      </h1>
      <p class="mt-2 text-themed-secondary">
        {{ $t('settings.subtitle') }}
      </p>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Dashboard Layout Card -->
      <Card class="h-full">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <i class="fas fa-th-large text-primary text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-themed-primary">{{ $t('settings.dashboard_layout.title') }}</h3>
              <p class="text-sm text-themed-muted">{{ $t('settings.dashboard_layout.subtitle') }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-themed-secondary">
            {{ $t('settings.dashboard_layout.description') }}
          </p>

          <button
            @click="goToEditDashboard"
            class="w-full px-4 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <i class="fas fa-edit"></i>
            <span>{{ $t('settings.dashboard_layout.edit_button') }}</span>
          </button>

          <div class="p-3 bg-themed-tertiary rounded-lg">
            <p class="text-xs text-themed-secondary">
              <i class="fas fa-info-circle mr-1"></i>
              {{ $t('settings.dashboard_layout.info') }}
            </p>
          </div>
        </div>
      </Card>

      <!-- Appearance Card -->
      <Card class="h-full">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <i class="fas fa-palette text-secondary text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-themed-primary">{{ $t('settings.appearance.title') }}</h3>
              <p class="text-sm text-themed-muted">{{ $t('settings.appearance.subtitle') }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-themed-primary mb-2">
              {{ $t('settings.appearance.theme_label') }}
            </label>
            <ThemeSwitcher />
          </div>

          <div>
            <label class="block text-sm font-medium text-themed-primary mb-2">
              {{ $t('settings.appearance.language_label') }}
            </label>
            <LanguageSwitcher />
          </div>
        </div>
      </Card>

      <!-- Notifications Card -->
      <Card class="h-full">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <i class="fas fa-bell text-warning text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-themed-primary">{{ $t('settings.notifications.title') }}</h3>
              <p class="text-sm text-themed-muted">{{ $t('settings.notifications.subtitle') }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-themed-tertiary rounded-lg">
            <div>
              <p class="text-sm font-medium text-themed-primary">{{ $t('settings.notifications.email_title') }}</p>
              <p class="text-xs text-themed-muted">{{ $t('settings.notifications.email_description') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer" checked>
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div class="flex items-center justify-between p-3 bg-themed-tertiary rounded-lg">
            <div>
              <p class="text-sm font-medium text-themed-primary">{{ $t('settings.notifications.push_title') }}</p>
              <p class="text-xs text-themed-muted">{{ $t('settings.notifications.push_description') }}</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer">
              <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </Card>

      <!-- Account Card -->
      <Card class="h-full">
        <template #header>
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <i class="fas fa-user-cog text-success text-lg"></i>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-themed-primary">{{ $t('settings.account.title') }}</h3>
              <p class="text-sm text-themed-muted">{{ $t('settings.account.subtitle') }}</p>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div class="p-3 bg-themed-tertiary rounded-lg">
            <p class="text-sm font-medium text-themed-primary mb-1">{{ userName }}</p>
            <p class="text-xs text-themed-muted">{{ userEmail }}</p>
          </div>

          <button
            @click="router.push('/profile')"
            class="w-full px-4 py-2 bg-themed-tertiary hover:bg-themed-tertiary/80 text-themed-primary rounded-lg font-medium transition-all"
          >
            {{ $t('settings.account.view_profile') }}
          </button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Card from '@/components/ui/Card.vue';
import ThemeSwitcher from '@/components/common/ThemeSwitcher.vue';
import LanguageSwitcher from '@/components/common/LanguageSwitcher.vue';

const router = useRouter();
const authStore = useAuthStore();

const userName = computed(() => authStore.userName);
const userEmail = computed(() => authStore.userEmail);

/**
 * Navigate to dashboard in edit mode
 */
const goToEditDashboard = () => {
  router.push('/dashboard?edit=true');
};
</script>
