<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ role?.name || $t('roles.show.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    Detalles del rol
                </p>
            </div>
            <div class="flex space-x-4">
                <button
                    @click="navigateToEdit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    {{ $t('common.edit') }}
                </button>
                <button
                    @click="navigateToList"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                    {{ $t('common.back') }}
                </button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Content -->
        <div v-else-if="role" class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Información Básica
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            {{ $t('roles.name') }}
                        </label>
                        <p class="mt-1 text-lg text-gray-900 dark:text-white">
                            {{ role.name }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            Guard Name
                        </label>
                        <p class="mt-1 text-lg text-gray-900 dark:text-white">
                            {{ role.guard_name }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            {{ $t('roles.permissions_count') }}
                        </label>
                        <p class="mt-1 text-lg text-gray-900 dark:text-white">
                            {{ role.permissions?.length || 0 }}
                        </p>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-500 dark:text-gray-400">
                            {{ $t('roles.show.created_at') }}
                        </label>
                        <p class="mt-1 text-lg text-gray-900 dark:text-white">
                            {{ formatDate(role.created_at) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Permissions List -->
            <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {{ $t('roles.permissions') }}
                </h2>

                <div v-if="role.permissions && role.permissions.length > 0">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div
                            v-for="permission in role.permissions"
                            :key="permission.id"
                            class="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                        >
                            <p class="text-sm text-blue-800 dark:text-blue-300 font-medium">
                                {{ permission.name }}
                            </p>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">
                        Este rol no tiene permisos asignados
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRoles } from '@/composables/useRoles';

const router = useRouter();
const route = useRoute();
const roleId = parseInt(route.params.id);

const { loading, role, fetchRole } = useRoles();

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const navigateToEdit = async () => {
    await router.push({ name: 'webmaster.roles.edit', params: { id: roleId } });
};

const navigateToList = async () => {
    await router.push({ name: 'webmaster.roles.index' });
};

onMounted(async () => {
    await fetchRole(roleId);
});
</script>
