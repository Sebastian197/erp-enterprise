<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ $t('roles.create') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
                {{ $t('roles.create.subtitle') }}
            </p>
        </div>

        <!-- Form -->
        <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <form @submit.prevent="handleSubmit">
                <!-- Basic Information -->
                <div class="mb-6">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {{ $t('roles.form.basic_info') }}
                    </h2>

                    <div class="space-y-4">
                        <!-- Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {{ $t('roles.form.name') }} *
                            </label>
                            <input
                                v-model="formData.name"
                                type="text"
                                required
                                :placeholder="$t('roles.form.name_placeholder')"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <!-- Guard Name (opcional) -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Guard Name
                            </label>
                            <input
                                v-model="formData.guard_name"
                                type="text"
                                placeholder="web"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Dejar vacío para usar "web" por defecto
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end space-x-4">
                    <button
                        type="button"
                        @click="handleCancel"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {{ $t('common.cancel') }}
                    </button>
                    <button
                        type="submit"
                        :disabled="loading"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span v-if="loading">{{ $t('common.loading') }}</span>
                        <span v-else>{{ $t('common.create') }}</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useRoles } from '@/composables/useRoles';

const router = useRouter();
const { loading, createRole } = useRoles();

const formData = reactive({
    name: '',
    guard_name: '',
});

const handleSubmit = async () => {
    try {
        const data = {
            name: formData.name,
        };

        if (formData.guard_name) {
            data.guard_name = formData.guard_name;
        }

        await createRole(data);
        await router.push({ name: 'webmaster.roles.index' });
    } catch (error) {
        console.error('Error al crear rol:', error);
        alert('Error al crear el rol. Por favor verifica los datos.');
    }
};

const handleCancel = async () => {
    await router.push({ name: 'webmaster.roles.index' });
};
</script>
