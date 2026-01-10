import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS, WEBSOCKET_EVENTS } from '@/utils/constants';
import { useWebSocket } from '@/composables/useWebSocket';

/**
 * Composable for role permission management
 *
 * Handles attaching, detaching, and syncing permissions to roles
 * with real-time WebSocket updates
 */
export function useRolePermissions(roleId = null) {
    const loading = ref(false);
    const permissions = ref([]);
    const { listenPrivate, stop } = useWebSocket();

    /**
     * Attach permissions to role
     */
    const attachPermissions = async (id, permissionIds) => {
        loading.value = true;
        try {
            const response = await api.post(API_ENDPOINTS.ROLES.ATTACH_PERMISSIONS(id), {
                permission_ids: permissionIds,
            });
            return response.data.data;
        } catch (error) {
            console.error('Error attaching permissions:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Detach permissions from role
     */
    const detachPermissions = async (id, permissionIds) => {
        loading.value = true;
        try {
            const response = await api.delete(API_ENDPOINTS.ROLES.DETACH_PERMISSIONS(id), {
                data: { permission_ids: permissionIds },
            });
            return response.data.data;
        } catch (error) {
            console.error('Error detaching permissions:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Sync permissions to role (replaces all)
     */
    const syncPermissions = async (id, permissionIds) => {
        loading.value = true;
        try {
            const response = await api.put(API_ENDPOINTS.ROLES.SYNC_PERMISSIONS(id), {
                permission_ids: permissionIds,
            });
            return response.data.data;
        } catch (error) {
            console.error('Error syncing permissions:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Setup WebSocket listeners for role permission updates
     */
    const setupWebSocketListeners = () => {
        // Listen for role permissions updated events
        listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_PERMISSIONS_UPDATED, (event) => {
            if (roleId && event.role && event.role.id === roleId) {
                permissions.value = event.role.permissions || [];
            }
        });

        // Listen for role updated events (might affect permissions)
        listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_UPDATED, (event) => {
            if (roleId && event.role && event.role.id === roleId && event.role.permissions) {
                permissions.value = event.role.permissions;
            }
        });
    };

    /**
     * Cleanup WebSocket listeners
     */
    const cleanupWebSocketListeners = () => {
        stop('admin', WEBSOCKET_EVENTS.ROLE_PERMISSIONS_UPDATED);
        stop('admin', WEBSOCKET_EVENTS.ROLE_UPDATED);
    };

    /**
     * Initialize WebSocket listeners on mount
     */
    onMounted(() => {
        if (roleId) {
            setupWebSocketListeners();
        }
    });

    /**
     * Cleanup on unmount
     */
    onUnmounted(() => {
        if (roleId) {
            cleanupWebSocketListeners();
        }
    });

    return {
        loading,
        permissions,
        attachPermissions,
        detachPermissions,
        syncPermissions,
        setupWebSocketListeners,
        cleanupWebSocketListeners,
    };
}
