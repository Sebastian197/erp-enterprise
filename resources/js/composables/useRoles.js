import { ref, reactive } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Composable for role management
 *
 * Provides methods and state for managing roles
 */
export function useRoles() {
    const loading = ref(false);
    const roles = ref([]);
    const role = ref(null);
    const filters = reactive({
        search: '',
    });

    /**
     * Fetch all roles
     */
    const fetchRoles = async (params = {}) => {
        loading.value = true;
        try {
            const response = await api.get(API_ENDPOINTS.ROLES.INDEX, {
                params: { ...filters, ...params },
            });
            roles.value = response.data.data;
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch single role by ID
     */
    const fetchRole = async (id) => {
        loading.value = true;
        try {
            const response = await api.get(API_ENDPOINTS.ROLES.SHOW(id));
            role.value = response.data.data;
            return response.data.data;
        } catch (error) {
            console.error('Error fetching role:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create new role
     */
    const createRole = async (data) => {
        loading.value = true;
        try {
            const response = await api.post(API_ENDPOINTS.ROLES.STORE, data);
            return response.data.data;
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update role
     */
    const updateRole = async (id, data) => {
        loading.value = true;
        try {
            const response = await api.put(API_ENDPOINTS.ROLES.UPDATE(id), data);
            return response.data.data;
        } catch (error) {
            console.error('Error updating role:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete role
     */
    const deleteRole = async (id) => {
        loading.value = true;
        try {
            await api.delete(API_ENDPOINTS.ROLES.DESTROY(id));
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Search roles
     */
    const searchRoles = (search) => {
        filters.search = search;
        return fetchRoles();
    };

    /**
     * Clear filters
     */
    const clearFilters = () => {
        filters.search = '';
        return fetchRoles();
    };

    return {
        loading,
        roles,
        role,
        filters,
        fetchRoles,
        fetchRole,
        createRole,
        updateRole,
        deleteRole,
        searchRoles,
        clearFilters,
    };
}
