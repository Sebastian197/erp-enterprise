import { ref, reactive } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS } from '@/utils/constants';

/**
 * Composable para gestionar categorías
 * Centraliza toda la lógica de negocio de CRUD de categorías
 * Usado por: Index.vue, Create.vue, Edit.vue, Show.vue
 */
export function useCategories() {
  // Estado reactivo
  const categories = ref([]);
  const category = ref(null);
  const loading = ref(false);
  const deleting = ref(false);
  const pagination = ref(null);
  const errors = reactive({});

  // Opciones para selects
  const groupOptions = ref([{ value: null, label: 'All Groups' }]);

  /**
   * Obtener lista de categorías con filtros y paginación
   * @param {Object} params - Parámetros de búsqueda (page, search, group_id, is_active)
   */
  const fetchCategories = async (params = {}) => {
    try {
      loading.value = true;
      const response = await api.get(API_ENDPOINTS.CATEGORIES.INDEX, { params });

      categories.value = response.data.data;

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
      console.error('Failed to fetch categories:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Obtener una categoría específica por ID
   * @param {number|string} id - ID de la categoría
   */
  const fetchCategory = async (id) => {
    try {
      loading.value = true;
      const response = await api.get(API_ENDPOINTS.CATEGORIES.SHOW(id));
      category.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Failed to fetch category:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crear nueva categoría
   * @param {Object} formData - Datos del formulario
   */
  const createCategory = async (formData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.post(API_ENDPOINTS.CATEGORIES.STORE, formData);
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
   * Actualizar categoría existente
   * @param {number|string} id - ID de la categoría
   * @param {Object} formData - Datos del formulario
   */
  const updateCategory = async (id, formData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), formData);
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
   * Actualizar costos de categoría
   * @param {number|string} id - ID de la categoría
   * @param {Object} costsData - Datos de costos
   */
  const updateCategoryCosts = async (id, costsData) => {
    try {
      loading.value = true;
      Object.keys(errors).forEach(key => delete errors[key]);

      const response = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE_COSTS(id), costsData);
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
   * Eliminar una categoría
   * @param {number|string} id - ID de la categoría
   */
  const deleteCategory = async (id) => {
    try {
      deleting.value = true;
      await api.delete(API_ENDPOINTS.CATEGORIES.DESTROY(id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    } finally {
      deleting.value = false;
    }
  };

  /**
   * Eliminar múltiples categorías
   * @param {Array<Object>} selectedCategories - Array de categorías a eliminar
   */
  const bulkDeleteCategories = async (selectedCategories) => {
    try {
      deleting.value = true;
      await Promise.all(
        selectedCategories.map(category => api.delete(API_ENDPOINTS.CATEGORIES.DESTROY(category.id)))
      );
    } catch (error) {
      console.error('Failed to bulk delete categories:', error);
      throw error;
    } finally {
      deleting.value = false;
    }
  };

  /**
   * Obtener grupos para select
   * Usado en Create.vue, Edit.vue y filtros de Index.vue
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
    categories.value = [];
    category.value = null;
    loading.value = false;
    deleting.value = false;
    pagination.value = null;
    clearErrors();
  };

  return {
    // Estado
    categories,
    category,
    loading,
    deleting,
    pagination,
    errors,

    // Opciones
    groupOptions,

    // Métodos
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    updateCategoryCosts,
    deleteCategory,
    bulkDeleteCategories,
    fetchGroups,
    clearErrors,
    reset,
  };
}
