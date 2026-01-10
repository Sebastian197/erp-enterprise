<template>
    <div class="space-y-6">
        <!-- Actions -->
        <div class="flex justify-between items-center">
            <div class="flex space-x-3">
                <button
                    @click="selectAll"
                    type="button"
                    class="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                >
                    {{ $t('roles.matrix.select_all') }}
                </button>
                <button
                    @click="deselectAll"
                    type="button"
                    class="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                >
                    {{ $t('roles.matrix.deselect_all') }}
                </button>
            </div>
            <button
                @click="handleSave"
                :disabled="syncing"
                type="button"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span v-if="syncing">Guardando...</span>
                <span v-else>{{ $t('roles.matrix.save') }}</span>
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <!-- Permission Matrix by Module -->
        <div v-else class="space-y-4">
            <div
                v-for="(permissions, module) in groupedPermissions"
                :key="module"
                class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
                <!-- Module Header -->
                <div class="bg-gray-50 dark:bg-gray-900 px-4 py-3 flex justify-between items-center">
                    <h3 class="text-sm font-semibold text-gray-900 dark:text-white uppercase">
                        {{ module }}
                    </h3>
                    <div class="flex space-x-2">
                        <button
                            @click="selectModule(module)"
                            type="button"
                            class="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/40"
                        >
                            Seleccionar todos
                        </button>
                        <button
                            @click="deselectModule(module)"
                            type="button"
                            class="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/40"
                        >
                            Deseleccionar todos
                        </button>
                    </div>
                </div>

                <!-- Permissions Grid -->
                <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <label
                        v-for="permission in permissions"
                        :key="permission.id"
                        class="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors"
                    >
                        <input
                            type="checkbox"
                            :checked="isPermissionSelected(permission.id)"
                            @change="togglePermission(permission.id)"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span class="text-sm text-gray-700 dark:text-gray-300">
                            {{ permission.name }}
                        </span>
                    </label>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="Object.keys(groupedPermissions).length === 0" class="text-center py-8">
                <p class="text-gray-500 dark:text-gray-400">
                    No hay permisos disponibles
                </p>
            </div>
        </div>

        <!-- Save Button (Bottom) -->
        <div class="flex justify-end">
            <button
                @click="handleSave"
                :disabled="syncing"
                type="button"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span v-if="syncing">Guardando...</span>
                <span v-else>{{ $t('roles.matrix.save') }}</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePermissionMatrix } from '@/composables/usePermissionMatrix';

const props = defineProps({
    roleId: {
        type: Number,
        required: true,
    },
    initialRole: {
        type: Object,
        default: null,
    },
});

const {
    allPermissions,
    selectedPermissions,
    groupedPermissions,
    loading,
    syncing,
    fetchPermissions,
    isPermissionSelected,
    togglePermission,
    selectAll,
    deselectAll,
    selectModule,
    deselectModule,
    savePermissions,
    initializeFromRole,
} = usePermissionMatrix(props.roleId);

const handleSave = async () => {
    try {
        await savePermissions();
        alert('Permisos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar permisos:', error);
        alert('Error al guardar los permisos');
    }
};

onMounted(async () => {
    await fetchPermissions();
    if (props.initialRole) {
        initializeFromRole(props.initialRole);
    }
});
</script>
