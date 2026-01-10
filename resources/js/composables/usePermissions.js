import { ref, reactive } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Composable for permission management
 *
 * Provides methods and state for managing permissions
 */
export function usePermissions() {
    const loading = ref(false);
    const permissions = ref([]);
    const permission = ref(null);
    const filters = reactive({
        search: '',
        group: null,
    });

    /**
     * Fetch all permissions
     */
    const fetchPermissions = async (params = {}) => {
        loading.value = true;
        try {
            const response = await api.get(API_ENDPOINTS.PERMISSIONS.INDEX, {
                params: { ...filters, ...params },
            });
            permissions.value = response.data.data;
            return response.data;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch single permission by ID
     */
    const fetchPermission = async (id) => {
        loading.value = true;
        try {
            const response = await api.get(API_ENDPOINTS.PERMISSIONS.SHOW(id));
            permission.value = response.data.data;
            return response.data.data;
        } catch (error) {
            console.error('Error fetching permission:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create new permission
     */
    const createPermission = async (data) => {
        loading.value = true;
        try {
            const response = await api.post(API_ENDPOINTS.PERMISSIONS.STORE, data);
            return response.data.data;
        } catch (error) {
            console.error('Error creating permission:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update permission
     */
    const updatePermission = async (id, data) => {
        loading.value = true;
        try {
            const response = await api.put(API_ENDPOINTS.PERMISSIONS.UPDATE(id), data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating permission:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete permission
     */
    const deletePermission = async (id) => {
        loading.value = true;
        try {
            await api.delete(API_ENDPOINTS.PERMISSIONS.DESTROY(id));
        } catch (error) {
            console.error('Error deleting permission:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Search permissions
     */
    const searchPermissions = (search) => {
        filters.search = search;
        return fetchPermissions();
    };

    /**
     * Filter permissions by group
     */
    const filterByGroup = (group) => {
        filters.group = group;
        return fetchPermissions();
    };

    /**
     * Clear filters
     */
    const clearFilters = () => {
        filters.search = '';
        filters.group = null;
        return fetchPermissions();
    };

    return {
        loading,
        permissions,
        permission,
        filters,
        fetchPermissions,
        fetchPermission,
        createPermission,
        updatePermission,
        deletePermission,
        searchPermissions,
        filterByGroup,
        clearFilters,
    };
}
