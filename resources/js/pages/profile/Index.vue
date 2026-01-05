<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ $t('profile.title') }}</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('profile.subtitle') }}</p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-gray-700">
      <nav class="flex space-x-8">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['pb-4 px-1 border-b-2 font-medium text-sm transition-colors', activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300']">
          <i :class="[tab.icon, 'mr-2']"></i>
          {{ $t(tab.label) }}
        </button>
      </nav>
    </div>

    <!-- Personal Info Tab -->
    <Card v-if="activeTab === 'personal'">
      <form @submit.prevent="updateProfile" class="space-y-6">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <img v-if="user.avatar" :src="user.avatar" alt="Avatar" class="w-24 h-24 rounded-full object-cover" />
            <div v-else class="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <span class="text-white text-2xl font-bold">{{ user.name?.substring(0, 2).toUpperCase() }}</span>
            </div>
            <label class="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors">
              <i class="fas fa-camera text-white text-xs"></i>
              <input type="file" accept="image/*" @change="handleAvatarChange" class="hidden" />
            </label>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ $t('profile.avatar') }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('profile.avatar_hint') }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input v-model="profileForm.name" :label="$t('profile.form.name')" :error="profileErrors.name" icon="fas fa-user" required />
          <Input v-model="profileForm.username" :label="$t('profile.form.username')" :error="profileErrors.username" icon="fas fa-at" disabled />
        </div>

        <div class="flex justify-end">
          <Button type="submit" variant="primary" :loading="savingProfile" icon="fas fa-save">{{ $t('common.save') }}</Button>
        </div>
      </form>
    </Card>

    <!-- Security Tab -->
    <Card v-if="activeTab === 'security'">
      <form @submit.prevent="updatePassword" class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ $t('profile.security.change_password') }}</h3>
          <div class="space-y-4">
            <Input v-model="passwordForm.current_password" type="password" :label="$t('profile.security.current_password')" :error="passwordErrors.current_password" icon="fas fa-lock" required />
            <Input v-model="passwordForm.new_password" type="password" :label="$t('profile.security.new_password')" :error="passwordErrors.new_password" icon="fas fa-lock" required />
            <Input v-model="passwordForm.new_password_confirmation" type="password" :label="$t('profile.security.confirm_password')" :error="passwordErrors.new_password_confirmation" icon="fas fa-lock" required />
          </div>
        </div>

        <div class="flex justify-end">
          <Button type="submit" variant="primary" :loading="savingPassword" icon="fas fa-save">{{ $t('profile.security.update_password') }}</Button>
        </div>
      </form>
    </Card>

    <!-- Preferences Tab -->
    <Card v-if="activeTab === 'preferences'">
      <form @submit.prevent="updatePreferences" class="space-y-6">
        <Select v-model="preferencesForm.language" :label="$t('profile.preferences.language')" :options="languageOptions" />
        <Select v-model="preferencesForm.theme" :label="$t('profile.preferences.theme')" :options="themeOptions" />
        <Select v-model="preferencesForm.timezone" :label="$t('profile.preferences.timezone')" :options="timezoneOptions" searchable />

        <div class="flex justify-end">
          <Button type="submit" variant="primary" :loading="savingPreferences" icon="fas fa-save">{{ $t('common.save') }}</Button>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { useI18n } from 'vue-i18n';
import Card from '@/components/ui/Card.vue';
import Input from '@/components/ui/Input.vue';
import Select from '@/components/ui/Select.vue';
import Button from '@/components/ui/Button.vue';
import { LOCALES } from '@/utils/constants';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const { locale } = useI18n();

const activeTab = ref('personal');
const savingProfile = ref(false);
const savingPassword = ref(false);
const savingPreferences = ref(false);

const user = computed(() => authStore.user);

const tabs = [
  { id: 'personal', label: 'profile.tabs.personal', icon: 'fas fa-user' },
  { id: 'security', label: 'profile.tabs.security', icon: 'fas fa-lock' },
  { id: 'preferences', label: 'profile.tabs.preferences', icon: 'fas fa-cog' },
];

const profileForm = reactive({ name: '', username: '' });
const profileErrors = reactive({});

const passwordForm = reactive({ current_password: '', new_password: '', new_password_confirmation: '' });
const passwordErrors = reactive({});

const preferencesForm = reactive({ language: 'en', theme: 'default-light', timezone: 'UTC' });

const languageOptions = Object.values(LOCALES).map(l => ({ value: l.code, label: l.name }));
const themeOptions = computed(() => themeStore.availableThemes.map(t => ({ value: t.id, label: t.name })));
const timezoneOptions = [{ value: 'UTC', label: 'UTC' }, { value: 'America/New_York', label: 'America/New_York' }];

const handleAvatarChange = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      await authStore.updateAvatar(file);
    } catch (error) {
      console.error('Failed to update avatar:', error);
    }
  }
};

const updateProfile = async () => {
  try {
    savingProfile.value = true;
    Object.keys(profileErrors).forEach(key => profileErrors[key] = '');
    await authStore.updateProfile(profileForm);
  } catch (error) {
    if (error.response?.data?.errors) Object.assign(profileErrors, error.response.data.errors);
  } finally {
    savingProfile.value = false;
  }
};

const updatePassword = async () => {
  try {
    savingPassword.value = true;
    Object.keys(passwordErrors).forEach(key => passwordErrors[key] = '');
    await authStore.updatePassword(passwordForm);
    Object.assign(passwordForm, { current_password: '', new_password: '', new_password_confirmation: '' });
  } catch (error) {
    if (error.response?.data?.errors) Object.assign(passwordErrors, error.response.data.errors);
  } finally {
    savingPassword.value = false;
  }
};

const updatePreferences = async () => {
  try {
    savingPreferences.value = true;
    locale.value = preferencesForm.language;
    themeStore.setTheme(preferencesForm.theme);
  } finally {
    savingPreferences.value = false;
  }
};

onMounted(() => {
  if (user.value) {
    Object.assign(profileForm, { name: user.value.name, username: user.value.username });
  }
  preferencesForm.language = locale.value;
  preferencesForm.theme = themeStore.currentTheme;
});
</script>
