/**
 * API Composable
 * Provides API functionality to components
 */

import { ref } from 'vue';
import api, { get, post, put, patch, del, upload } from '@/utils/api';
import { useNotification } from './useNotification';

export function useApi() {
    const notification = useNotification();
    const loading = ref(false);
    const error = ref(null);

    /**
     * Make GET request
     * @param {string} url - Request URL
     * @param {object} config - Axios config
     * @param {object} options - Additional options
     * @returns {Promise}
     */
    const apiGet = async (url, config = {}, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await get(url, config);

            if (options.successMessage) {
                notification.success(options.successMessage);
            }

            return response.data;
        } catch (err) {
            error.value = err;

            if (options.errorMessage !== false) {
                const message = options.errorMessage || err.message || 'Request failed';
                notification.error(message);
            }

            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Make POST request
     * @param {string} url - Request URL
     * @param {object} data - Request data
     * @param {object} config - Axios config
     * @param {object} options - Additional options
     * @returns {Promise}
     */
    const apiPost = async (url, data = {}, config = {}, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await post(url, data, config);

            if (options.successMessage) {
                notification.success(options.successMessage);
            }

            return response.data;
        } catch (err) {
            error.value = err;

            if (options.errorMessage !== false) {
                const message = options.errorMessage || err.message || 'Request failed';
                notification.error(message);
            }

            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Make PUT request
     * @param {string} url - Request URL
     * @param {object} data - Request data
     * @param {object} config - Axios config
     * @param {object} options - Additional options
     * @returns {Promise}
     */
    const apiPut = async (url, data = {}, config = {}, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await put(url, data, config);

            if (options.successMessage) {
                notification.success(options.successMessage);
            }

            return response.data;
        } catch (err) {
            error.value = err;

            if (options.errorMessage !== false) {
                const message = options.errorMessage || err.message || 'Request failed';
                notification.error(message);
            }

            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Make PATCH request
     * @param {string} url - Request URL
     * @param {object} data - Request data
     * @param {object} config - Axios config
     * @param {object} options - Additional options
     * @returns {Promise}
     */
    const apiPatch = async (url, data = {}, config = {}, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await patch(url, data, config);

            if (options.successMessage) {
                notification.success(options.successMessage);
            }

            return response.data;
        } catch (err) {
            error.value = err;

            if (options.errorMessage !== false) {
                const message = options.errorMessage || err.message || 'Request failed';
                notification.error(message);
            }

            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Make DELETE request
     * @param {string} url - Request URL
     * @param {object} config - Axios config
     * @param {object} options - Additional options
     * @returns {Promise}
     */
    const apiDelete = async (url, config = {}, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await del(url, config);

            if (options.successMessage) {
                notification.success(options.successMessage);
            }

            return response.data;
        } catch (err) {
            error.value = err;

            if (options.errorMessage !== false) {
                const message = options.errorMessage || err.message || 'Request failed';
                notification.error(message);
            }

            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Upload file(s)
     * @param {string} url - Request URL
     * @param {FormData|object} data - File data
     * @param {object} config - Axios config
     * @param {object} options - Additional options
     * @returns {Promise}
     */
    const apiUpload = async (url, data, config = {}, options = {}) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await upload(url, data, config);

            if (options.successMessage) {
                notification.success(options.successMessage);
            }

            return response.data;
        } catch (err) {
            error.value = err;

            if (options.errorMessage !== false) {
                const message = options.errorMessage || err.message || 'Upload failed';
                notification.error(message);
            }

            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Clear error
     */
    const clearError = () => {
        error.value = null;
    };

    return {
        // State
        loading,
        error,

        // Methods
        get: apiGet,
        post: apiPost,
        put: apiPut,
        patch: apiPatch,
        delete: apiDelete,
        upload: apiUpload,
        clearError,

        // Direct api access
        api,
    };
}