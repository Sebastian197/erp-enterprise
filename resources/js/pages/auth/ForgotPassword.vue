<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {{ $t('auth.forgot_password.title') }}
    </h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
      {{ $t('auth.forgot_password.description') }}
    </p>

    <!-- Success Message -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
    >
      <div
        v-if="successMessage"
        class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
      >
        <div class="flex items-center">
          <i class="fas fa-check-circle text-green-600 dark:text-green-400 mr-2"></i>
          <p class="text-sm text-green-600 dark:text-green-400">
            {{ successMessage }}
          </p>
        </div>
      </div>
    </transition>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email Input -->
      <Input
        v-model="form.email"
        type="email"
        :label="$t('auth.forgot_password.email')"
        :placeholder="$t('auth.forgot_password.email_placeholder')"
        :error="errors.email"
        icon="fas fa-envelope"
        required
        autocomplete="email"
      />

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
        :disabled="loading || !!successMessage"
        full-width
      >
        {{ $t('auth.forgot_password.submit') }}
      </Button>

      <!-- Back to Login -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <i class="fas fa-arrow-left mr-1"></i>
          {{ $t('auth.forgot_password.back_to_login') }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

/**
 * ForgotPassword Page
 * Request password reset email
 * Features: Form validation, success message, error handling
 */

const authStore = useAuthStore();

// State
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const form = reactive({
  email: '',
});

const errors = reactive({
  email: '',
});

/**
 * Validate form
 */
const validateForm = () => {
  errors.email = '';

  if (!form.email) {
    errors.email = 'Email is required';
    return false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email';
    return false;
  }

  return true;
};

/**
 * Handle form submission
 */
const handleSubmit = async () => {
  successMessage.value = '';
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    await authStore.forgotPassword(form.email);

    successMessage.value = 'Password reset link has been sent to your email address.';
    form.email = '';
  } catch (error) {
    console.error('Forgot password error:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to send reset email. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
