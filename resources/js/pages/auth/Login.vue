<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('auth.login.title') }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email Input -->
      <Input
        v-model="form.email"
        type="email"
        :label="$t('auth.login.email')"
        :placeholder="$t('auth.login.email_placeholder')"
        :error="errors.email"
        icon="fas fa-envelope"
        required
        autocomplete="email"
      />

      <!-- Password Input -->
      <Input
        v-model="form.password"
        type="password"
        :label="$t('auth.login.password')"
        :placeholder="$t('auth.login.password_placeholder')"
        :error="errors.password"
        icon="fas fa-lock"
        required
        autocomplete="current-password"
      />

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center">
          <input
            v-model="form.remember"
            type="checkbox"
            class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {{ $t('auth.login.remember_me') }}
          </span>
        </label>

        <router-link
          to="/auth/forgot-password"
          class="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          {{ $t('auth.login.forgot_password') }}
        </router-link>
      </div>

      <!-- Error Message -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          v-if="errorMessage"
          class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div class="flex items-center">
            <i class="fas fa-exclamation-circle text-red-600 dark:text-red-400 mr-2"></i>
            <p class="text-sm text-red-600 dark:text-red-400">
              {{ errorMessage }}
            </p>
          </div>
        </div>
      </transition>

      <!-- Submit Button -->
      <Button
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        :disabled="loading"
        full-width
      >
        {{ $t('auth.login.submit') }}
      </Button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

/**
 * Login Page
 * User authentication with email and password
 * Features: Form validation, error handling, remember me, loading state
 */

const router = useRouter();
const authStore = useAuthStore();

// State
const loading = ref(false);
const errorMessage = ref('');
const form = reactive({
  email: '',
  password: '',
  remember: false,
});

const errors = reactive({
  email: '',
  password: '',
});

/**
 * Validate form
 */
const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';

  if (!form.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
    isValid = false;
  }

  return isValid;
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    await authStore.login({
      email: form.email,
      password: form.password,
      remember: form.remember,
    });

    // Redirect to dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Invalid email or password. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
