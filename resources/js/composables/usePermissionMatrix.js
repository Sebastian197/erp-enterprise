import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePermissions } from '@/composables/usePermissions';
import { useRolePermissions } from '@/composables/useRolePermissions';
import { WEBSOCKET_EVENTS } from '@/utils/constants';
import { useWebSocket } from '@/composables/useWebSocket';

/**
 * Composable for permission matrix management
 *
 * Manages the permission matrix UI with role-permission relationships
 * and real-time updates via WebSocket
 */
export function usePermissionMatrix(roleId) {
    const { permissions: allPermissions, fetchPermissions } = usePermissions();
    const { syncPermissions, loading: syncing } = useRolePermissions(roleId);
    const { listenPrivate, stop } = useWebSocket();

    const selectedPermissions = ref(new Set());
    const loading = ref(false);

    /**
     * Group permissions by module (prefix before dot)
     */
    const groupedPermissions = computed(() => {
        const groups = {};

        allPermissions.value.forEach(permission => {
            const parts = permission.name.split('.');
            const module = parts[0] || 'other';

            if (!groups[module]) {
                groups[module] = [];
            }

            groups[module].push(permission);
        });

        return groups;
    });

    /**
     * Check if permission is selected
     */
    const isPermissionSelected = (permissionId) => {
        return selectedPermissions.value.has(permissionId);
    };

    /**
     * Toggle permission selection
     */
    const togglePermission = (permissionId) => {
        if (selectedPermissions.value.has(permissionId)) {
            selectedPermissions.value.delete(permissionId);
        } else {
            selectedPermissions.value.add(permissionId);
        }
    };

    /**
     * Select all permissions
     */
    const selectAll = () => {
        allPermissions.value.forEach(permission => {
            selectedPermissions.value.add(permission.id);
        });
    };

    /**
     * Deselect all permissions
     */
    const deselectAll = () => {
        selectedPermissions.value.clear();
    };

    /**
     * Select all permissions in a module
     */
    const selectModule = (module) => {
        const modulePermissions = groupedPermissions.value[module] || [];
        modulePermissions.forEach(permission => {
            selectedPermissions.value.add(permission.id);
        });
    };

    /**
     * Deselect all permissions in a module
     */
    const deselectModule = (module) => {
        const modulePermissions = groupedPermissions.value[module] || [];
        modulePermissions.forEach(permission => {
            selectedPermissions.value.delete(permission.id);
        });
    };

    /**
     * Save permissions (sync to backend)
     */
    const savePermissions = async () => {
        const permissionIds = Array.from(selectedPermissions.value);
        try {
            await syncPermissions(roleId, permissionIds);
            return true;
        } catch (error) {
            console.error('Error saving permissions:', error);
            throw error;
        }
    };

    /**
     * Initialize selected permissions from role data
     */
    const initializeFromRole = (role) => {
        selectedPermissions.value.clear();
        if (role && role.permissions) {
            role.permissions.forEach(permission => {
                selectedPermissions.value.add(permission.id);
            });
        }
    };

    /**
     * Setup WebSocket listeners for real-time updates
     */
    const setupWebSocketListeners = () => {
        listenPrivate('admin', WEBSOCKET_EVENTS.ROLE_PERMISSIONS_UPDATED, (event) => {
            if (event.role && event.role.id === roleId) {
                initializeFromRole(event.role);
            }
        });
    };

    /**
     * Cleanup WebSocket listeners
     */
    const cleanupWebSocketListeners = () => {
        stop('admin', WEBSOCKET_EVENTS.ROLE_PERMISSIONS_UPDATED);
    };

    /**
     * Initialize on mount
     */
    onMounted(() => {
        setupWebSocketListeners();
    });

    /**
     * Cleanup on unmount
     */
    onUnmounted(() => {
        cleanupWebSocketListeners();
    });

    return {
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
    };
}
