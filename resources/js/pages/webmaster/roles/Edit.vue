<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="mb-6">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                {{ $t('roles.edit') }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
                {{ $t('roles.edit.subtitle') }}
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Form -->
        <div v-else-if="role" class="space-y-6">
            <!-- Basic Information -->
            <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {{ $t('roles.form.basic_info') }}
                </h2>

                <form @submit.prevent="handleSubmit">
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
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>

                        <!-- Guard Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Guard Name
                            </label>
                            <input
                                v-model="formData.guard_name"
                                type="text"
                                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-between items-center mt-6">
                        <button
                            type="button"
                            @click="confirmDelete"
                            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                            {{ $t('common.delete') }}
                        </button>
                        <div class="flex space-x-4">
                            <button
                                type="button"
                                @click="handleCancel"
                                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                {{ $t('common.cancel') }}
                            </button>
                            <button
                                type="submit"
                                :disabled="updating"
                                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <span v-if="updating">{{ $t('common.loading') }}</span>
                                <span v-else>{{ $t('common.update') }}</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <!-- Permission Matrix -->
            <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {{ $t('roles.matrix.title') }}
                </h2>
                <PermissionMatrix :role-id="roleId" :initial-role="role" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRoles } from '@/composables/useRoles';
import PermissionMatrix from '@/components/permissions/PermissionMatrix.vue';

const router = useRouter();
const route = useRoute();
const roleId = parseInt(route.params.id);

const { loading, role, fetchRole, updateRole, deleteRole } = useRoles();
const updating = ref(false);

const formData = reactive({
    name: '',
    guard_name: '',
});

const loadRole = async () => {
    const data = await fetchRole(roleId);
    formData.name = data.name;
    formData.guard_name = data.guard_name || 'web';
};

const handleSubmit = async () => {
    updating.value = true;
    try {
        await updateRole(roleId, {
            name: formData.name,
            guard_name: formData.guard_name,
        });
        await router.push({ name: 'webmaster.roles.index' });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        alert('Error al actualizar el rol.');
    } finally {
        updating.value = false;
    }
};

const handleCancel = async () => {
    await router.push({ name: 'webmaster.roles.index' });
};

const confirmDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar el rol "${formData.name}"?`)) {
        return;
    }

    try {
        await deleteRole(roleId);
        await router.push({ name: 'webmaster.roles.index' });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        alert('Error al eliminar el rol.');
    }
};

onMounted(async () => {
    await loadRole();
});
</script>
