<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
                    {{ $t('roles.title') }}
                </h1>
                <p class="text-gray-600 dark:text-gray-400 mt-1">
                    {{ $t('roles.subtitle') }}
                </p>
            </div>
            <button
                @click="navigateToCreate"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
                + {{ $t('roles.create') }}
            </button>
        </div>

        <!-- Search -->
        <div class="mb-6">
            <input
                v-model="filters.search"
                @input="searchRoles(filters.search)"
                type="text"
                :placeholder="$t('common.search')"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>

        <!-- Roles Table -->
        <div v-else-if="roles.length > 0" class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {{ $t('roles.name') }}
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {{ $t('roles.permissions_count') }}
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            {{ $t('common.actions') }}
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr v-for="role in roles" :key="role.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {{ role.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {{ role.permissions?.length || 0 }} {{ $t('roles.permissions') }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                                @click="navigateToShow(role.id)"
                                class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {{ $t('common.view') }}
                            </button>
                            <button
                                @click="navigateToEdit(role.id)"
                                class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                {{ $t('common.edit') }}
                            </button>
                            <button
                                @click="confirmDelete(role)"
                                class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                                {{ $t('common.delete') }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-12 text-center">
            <p class="text-gray-500 dark:text-gray-400">{{ $t('common.no_data') }}</p>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRoles } from '@/composables/useRoles';
import { useWebSocket } from '@/composables/useWebSocket';
import { WEBSOCKET_EVENTS } from '@/utils/constants';

const router = useRouter();
const { loading, roles, filters, fetchRoles, deleteRole, searchRoles } = useRoles();
const { listenPrivate, stop, connect } = useWebSocket();

// Navigation methods
const navigateToCreate = async () => {
    await router.push({ name: 'webmaster.roles.create' });
};

const navigateToShow = async (id) => {
    await router.push({ name: 'webmaster.roles.show', params: { id } });
};

const navigateToEdit = async (id) => {
    await router.push({ name: 'webmaster.roles.edit', params: { id } });
};

// Delete role with confirmation
const confirmDelete = async (role) => {
    if (!confirm(`Are you sure you want to delete "${role.name}"?`)) {
        return;
    }

    try {
        await deleteRole(role.id);
        await fetchRoles();
    } catch (error) {
        console.error('Failed to delete role:', error);
    }
};

// WebSocket listeners
const setupWebSocketListeners = () => {
    listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_CREATED, (event) => {
        if (event.role) {
            roles.value.push(event.role);
        }
    });

    listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_UPDATED, (event) => {
        if (event.role) {
            const index = roles.value.findIndex(r => r.id === event.role.id);
            if (index !== -1) {
                roles.value[index] = event.role;
            }
        }
    });

    listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_DELETED, (event) => {
        if (event.role) {
            roles.value = roles.value.filter(r => r.id !== event.role.id);
        }
    });

    listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_PERMISSIONS_UPDATED, (event) => {
        if (event.role) {
            const index = roles.value.findIndex(r => r.id === event.role.id);
            if (index !== -1) {
                roles.value[index] = { ...roles.value[index], permissions: event.role.permissions };
            }
        }
    });
};

const cleanupWebSocketListeners = () => {
    stop('admin', WEBSOCKET_EVENTS.ROLE_CREATED);
    stop('admin', WEBSOCKET_EVENTS.ROLE_UPDATED);
    stop('admin', WEBSOCKET_EVENTS.ROLE_DELETED);
    stop('admin', WEBSOCKET_EVENTS.ROLE_PERMISSIONS_UPDATED);
};

onMounted(async () => {
    connect();
    await fetchRoles();
    setupWebSocketListeners();
});

onUnmounted(() => {
    cleanupWebSocketListeners();
});
</script>
