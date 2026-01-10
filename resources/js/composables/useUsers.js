import { ref, reactive } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Composable para gestionar usuarios
 * Centraliza toda la lógica de negocio de CRUD de usuarios
 * Usado por: Index.vue, Create.vue, Edit.vue, Show.vue
 */
export function useUsers() {
  // Estado reactivo
  const users = ref([]);
  const user = ref(null);
  const loading = ref(false);
  const deleting = ref(false);
  const pagination = ref(null);
  const errors = reactive({});

  // Opciones para selects
  const groupOptions = ref([{ value: null, label: 'All Groups' }]);
  const categoryOptions = ref([]);
  const roleOptions = ref([]);

  /**
   * Obtener lista de usuarios con filtros y paginación
   * @param {Object} params - Parámetros de búsqueda (page, search, group, status)
   */
  const fetchUsers = async (params = {}) => {
    try {
      loading.value = true;
      const response = await api.get(API_ENDPOINTS.USERS.INDEX, { params });

      users.value = response.data.data;
      pagination.value = {
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        per_page: response.data.per_page,
        total: response.data.total,
        from: response.data.from,
        to: response.data.to,
      };

      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener un usuario específico por ID
   * @param {number|string} id - ID del usuario
   */
  const fetchUser = async (id) => {
    try {
      loading.value = true;
      const response = await api.get(API_ENDPOINTS.USERS.SHOW(id));
      user.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear nuevo usuario
   * @param {Object} formData - Datos del formulario
   */
  const createUser = async (formData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.post(API_ENDPOINTS.USERS.STORE, formData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.assign(errors, error.response.data.errors);
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar usuario existente
   * @param {number|string} id - ID del usuario
   * @param {Object} formData - Datos del formulario
   */
  const updateUser = async (id, formData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id), formData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.errors) {
        Object.assign(errors, error.response.data.errors);
      }
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Eliminar un usuario
   * @param {number|string} id - ID del usuario
   */
  const deleteUser = async (id) => {
    try {
      deleting.value = true;
      await api.delete(API_ENDPOINTS.USERS.DESTROY(id));
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    } finally {
      deleting.value = false;
    }
  };

  /**
   * Eliminar múltiples usuarios
   * @param {Array<Object>} selectedUsers - Array de usuarios a eliminar
   */
  const bulkDeleteUsers = async (selectedUsers) => {
    try {
      deleting.value = true;
      await Promise.all(
        selectedUsers.map(user => api.delete(API_ENDPOINTS.USERS.DESTROY(user.id)))
      );
    } catch (error) {
      console.error('Failed to bulk delete users:', error);
      throw error;
    } finally {
      deleting.value = false;
    }
  };

  /**
   * Obtener opciones para selects (grupos, categorías, roles)
   * Usado en Create.vue y Edit.vue
   */
  const fetchOptions = async () => {
    try {
      const [groups, categories, roles] = await Promise.all([
        api.get(API_ENDPOINTS.GROUPS.INDEX),
        api.get(API_ENDPOINTS.CATEGORIES.INDEX),
        api.get(API_ENDPOINTS.ROLES.INDEX),
      ]);

      groupOptions.value = [
        { value: null, label: 'All Groups' },
        ...groups.data.data.map(g => ({ value: g.id, label: g.name }))
      ];
      categoryOptions.value = categories.data.data.map(c => ({
        value: c.id,
        label: c.name
      }));
      roleOptions.value = roles.data.data.map(r => ({
        value: r.id,
        label: r.name
      }));

      return { groups, categories, roles };
    } catch (error) {
      console.error('Failed to fetch options:', error);
      throw error;
    }
  };

  /**
   * Obtener solo grupos (para filtro en Index.vue)
   */
  const fetchGroups = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.GROUPS.INDEX);
      groupOptions.value = [
        { value: null, label: 'All Groups' },
        ...response.data.data.map(g => ({ value: g.id, label: g.name })),
      ];
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      throw error;
    }
  };

  /**
   * Limpiar errores de validación
   */
  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key]);
  };

  /**
   * Resetear estado
   */
  const reset = () => {
    users.value = [];
    user.value = null;
    loading.value = false;
    deleting.value = false;
    pagination.value = null;
    clearErrors();
  };

  return {
    // Estado
    users,
    user,
    loading,
    deleting,
    pagination,
    errors,

    // Opciones
    groupOptions,
    categoryOptions,
    roleOptions,

    // Métodos
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    bulkDeleteUsers,
    fetchOptions,
    fetchGroups,
    clearErrors,
    reset,
  };
}
