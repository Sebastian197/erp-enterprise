<template>
  <div class="bg-white rounded-3xl shadow-2xl p-8">
    <!-- Error Message -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="errorMessage"
        class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
      >
        <div class="flex items-start">
          <i class="fas fa-exclamation-circle text-danger-500 mr-2 mt-0.5"></i>
          <p class="text-sm text-danger-700">{{ errorMessage }}</p>
        </div>
      </div>
    </transition>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <!-- Username Input -->
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('auth.login.username') }}
        </label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          autocomplete="username"
          :placeholder="$t('auth.login.username_placeholder')"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder-gray-400"
          :class="{ 'border-danger-500 focus:ring-danger-500': errors.username }"
        />
        <p v-if="errors.username" class="mt-1.5 text-sm text-danger-600">
          {{ errors.username }}
        </p>
      </div>

      <!-- Password Input -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
          {{ $t('auth.login.password') }}
        </label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="current-password"
            :placeholder="$t('auth.login.password_placeholder')"
            class="w-full px-4 py-3 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-gray-900 placeholder-gray-400"
            :class="{ 'border-danger-500 focus:ring-danger-500': errors.password }"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" class="text-sm"></i>
          </button>
        </div>
        <p v-if="errors.password" class="mt-1.5 text-sm text-danger-600">
          {{ errors.password }}
        </p>
      </div>

      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <label class="flex items-center cursor-pointer">
          <input
            v-model="form.remember"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="ml-2 text-sm text-gray-600">
            {{ $t('auth.login.remember_me') }}
          </span>
        </label>

        <router-link
          to="/auth/forgot-password"
          class="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {{ $t('auth.login.forgot_password') }}
        </router-link>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center space-x-2"
        :class="loading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'"
      >
        <i v-if="loading" class="fas fa-spinner fa-spin"></i>
        <span>{{ loading ? 'Iniciando sesión...' : $t('auth.login.submit') }}</span>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const form = reactive({
  username: '',
  password: '',
  remember: false,
});

const errors = reactive({
  username: '',
  password: '',
});

const validateForm = () => {
  let isValid = true;
  errors.username = '';
  errors.password = '';

  if (!form.username) {
    errors.username = 'El nombre de usuario es obligatorio';
    isValid = false;
  } else if (form.username.length < 3) {
    errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    isValid = false;
  }

  if (!form.password) {
    errors.password = 'La contraseña es obligatoria';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  errorMessage.value = '';

  if (!validateForm()) {
    return;
  }

  try {
    loading.value = true;

    await authStore.login({
      username: form.username,
      password: form.password,
      remember: form.remember,
    });

    router.push('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Credenciales inválidas. Por favor verifica tu nombre de usuario y contraseña.';
  } finally {
    loading.value = false;
  }
};
</script>