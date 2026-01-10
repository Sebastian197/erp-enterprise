<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
      {{ $t('auth.reset_password.title') }}
    </h2>
    <p class="text-sm text-gray-600 dark:text-gray-400 mb-6">
      {{ $t('auth.reset_password.description') }}
    </p>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email Input -->
      <Input
        v-model="form.email"
        type="email"
        :label="$t('auth.reset_password.email')"
        :placeholder="$t('auth.reset_password.email_placeholder')"
        :error="errors.email"
        icon="fas fa-envelope"
        required
        autocomplete="email"
      />

      <!-- New Password Input -->
      <Input
        v-model="form.password"
        type="password"
        :label="$t('auth.reset_password.new_password')"
        :placeholder="$t('auth.reset_password.password_placeholder')"
        :error="errors.password"
        icon="fas fa-lock"
        required
        autocomplete="new-password"
      />

      <!-- Password Strength Indicator -->
      <div v-if="form.password" class="space-y-2">
        <div class="flex items-center space-x-2">
          <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full transition-all duration-300',
                passwordStrengthColor,
              ]"
              :style="{ width: `${passwordStrength}%` }"
            ></div>
          </div>
          <span :class="['text-xs font-medium', passwordStrengthColor.replace('bg-', 'text-')]">
            {{ passwordStrengthLabel }}
          </span>
        </div>
      </div>

      <!-- Confirm Password Input -->
      <Input
        v-model="form.password_confirmation"
        type="password"
        :label="$t('auth.reset_password.confirm_password')"
        :placeholder="$t('auth.reset_password.confirm_password_placeholder')"
        :error="errors.password_confirmation"
        icon="fas fa-lock"
        required
        autocomplete="new-password"
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
        :disabled="loading"
        full-width
      >
        {{ $t('auth.reset_password.submit') }}
      </Button>

      <!-- Back to Login -->
      <div class="text-center">
        <router-link
          to="/auth/login"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <i class="fas fa-arrow-left mr-1"></i>
          {{ $t('auth.reset_password.back_to_login') }}
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Input from '@/components/ui/Input.vue';
import Button from '@/components/ui/Button.vue';

/**
 * ResetPassword Page
 * Reset user password with token from email
 * Features: Password strength indicator, validation, error handling
 */

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// State
const loading = ref(false);
const errorMessage = ref('');
const form = reactive({
  token: route.params.token || '',
  email: '',
  password: '',
  password_confirmation: '',
});

const errors = reactive({
  email: '',
  password: '',
  password_confirmation: '',
});

/**
 * Calculate password strength
 */
const passwordStrength = computed(() => {
  const password = form.password;
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;

  return Math.min(strength, 100);
});

const passwordStrengthLabel = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'Weak';
  if (strength < 70) return 'Medium';
  return 'Strong';
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength < 40) return 'bg-red-500';
  if (strength < 70) return 'bg-yellow-500';
  return 'bg-green-500';
});

/**
 * Validate form
 */
const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';
  errors.password_confirmation = '';

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

  if (!form.password_confirmation) {
    errors.password_confirmation = 'Please confirm your password';
    isValid = false;
  } else if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match';
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

    await authStore.resetPassword({
      token: form.token,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
    });

    // Redirect to login with success message
    await router.push({
      name: 'login',
      query: { reset: 'success' },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to reset password. The link may be expired.';
  } finally {
    loading.value = false;
  }
};
</script>
