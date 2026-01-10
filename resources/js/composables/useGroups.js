import { ref, reactive } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Composable para gestionar grupos
 * Centraliza toda la lógica de negocio de CRUD de grupos
 * Usado por: Index.vue, Create.vue, Edit.vue, Show.vue
 */
export function useGroups() {
  // Estado reactivo
  const groups = ref([]);
  const group = ref(null);
  const loading = ref(false);
  const deleting = ref(false);
  const pagination = ref(null);
  const errors = reactive({});

  /**
   * Obtener lista de grupos con filtros y paginación
   * @param {Object} params - Parámetros de búsqueda (page, search, is_active)
   */
  const fetchGroups = async (params = {}) => {
    try {
      loading.value = true;
      const response = await api.get(API_ENDPOINTS.GROUPS.INDEX, { params });

      groups.value = response.data.data;

      if (response.data.current_page) {
        pagination.value = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        };
      }

      return response.data;
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener un grupo específico por ID
   * @param {number|string} id - ID del grupo
   */
  const fetchGroup = async (id) => {
    try {
      loading.value = true;
      const response = await api.get(API_ENDPOINTS.GROUPS.SHOW(id));
      group.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch group:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear nuevo grupo
   * @param {Object} formData - Datos del formulario
   */
  const createGroup = async (formData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.post(API_ENDPOINTS.GROUPS.STORE, formData);
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
   * Actualizar grupo existente
   * @param {number|string} id - ID del grupo
   * @param {Object} formData - Datos del formulario
   */
  const updateGroup = async (id, formData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.put(API_ENDPOINTS.GROUPS.UPDATE(id), formData);
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
   * Eliminar un grupo
   * @param {number|string} id - ID del grupo
   */
  const deleteGroup = async (id) => {
    try {
      deleting.value = true;
      await api.delete(API_ENDPOINTS.GROUPS.DESTROY(id));
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    } finally {
      deleting.value = false;
    }
  };

  /**
   * Eliminar múltiples grupos
   * @param {Array<Object>} selectedGroups - Array de grupos a eliminar
   */
  const bulkDeleteGroups = async (selectedGroups) => {
    try {
      deleting.value = true;
      await Promise.all(
        selectedGroups.map(group => api.delete(API_ENDPOINTS.GROUPS.DESTROY(group.id)))
      );
    } catch (error) {
      console.error('Failed to bulk delete groups:', error);
      throw error;
    } finally {
      deleting.value = false;
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
    groups.value = [];
    group.value = null;
    loading.value = false;
    deleting.value = false;
    pagination.value = null;
    clearErrors();
  };

  return {
    // Estado
    groups,
    group,
    loading,
    deleting,
    pagination,
    errors,

    // Métodos
    fetchGroups,
    fetchGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    bulkDeleteGroups,
    clearErrors,
    reset,
  };
}
