/**
 * API utility module for making HTTP requests
 * Configures axios with authentication, CSRF protection, and error handling
 */

import axios from 'axios';
import router from '@/router';

/**
 * Create axios instance with base configuration
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

/**
 * Request interceptor to attach authentication token
 */
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('auth_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Get CSRF token from meta tag or cookie
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor to handle errors globally
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (!error.response) {
            // Network error
            console.error('Network error:', error);
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                type: 'network',
            });
        }

        const { status, data } = error.response;

        switch (status) {
            case 401:
                // Unauthorized - clear auth and redirect to login
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_user');

                if (router.currentRoute.value.name !== 'login') {
                    await router.push({
                        name: 'login',
                        query: { redirect: router.currentRoute.value.fullPath },
                    });
                }
                break;

            case 403:
                // Forbidden - redirect to forbidden page
                await router.push({ name: 'forbidden' });
                break;

            case 404:
                // Not found
                console.error('Resource not found:', error.config.url);
                break;

            case 422:
                // Validation error - return validation errors
                return Promise.reject({
                    message: data.message || 'Validation failed',
                    errors: data.errors || {},
                    type: 'validation',
                });

            case 429:
                // Too many requests
                return Promise.reject({
                    message: 'Too many requests. Please try again later.',
                    type: 'rate_limit',
                });

            case 500:
            case 502:
            case 503:
            case 504:
                // Server error
                console.error('Server error:', error);
                return Promise.reject({
                    message: data.message || 'Server error. Please try again later.',
                    type: 'server',
                });

            default:
                console.error('API error:', error);
        }

        return Promise.reject({
            message: data.message || 'An error occurred',
            errors: data.errors || {},
            type: 'unknown',
            status,
        });
    }
);

/**
 * GET request wrapper
 * @param {string} url - Request URL
 * @param {object} config - Axios config
 * @returns {Promise} Response promise
 */
export const get = (url, config = {}) => {
    return api.get(url, config);
};

/**
 * POST request wrapper
 * @param {string} url - Request URL
 * @param {object} data - Request data
 * @param {object} config - Axios config
 * @returns {Promise} Response promise
 */
export const post = (url, data = {}, config = {}) => {
    return api.post(url, data, config);
};

/**
 * PUT request wrapper
 * @param {string} url - Request URL
 * @param {object} data - Request data
 * @param {object} config - Axios config
 * @returns {Promise} Response promise
 */
export const put = (url, data = {}, config = {}) => {
    return api.put(url, data, config);
};

/**
 * PATCH request wrapper
 * @param {string} url - Request URL
 * @param {object} data - Request data
 * @param {object} config - Axios config
 * @returns {Promise} Response promise
 */
export const patch = (url, data = {}, config = {}) => {
    return api.patch(url, data, config);
};

/**
 * DELETE request wrapper
 * @param {string} url - Request URL
 * @param {object} config - Axios config
 * @returns {Promise} Response promise
 */
export const del = (url, config = {}) => {
    return api.delete(url, config);
};

/**
 * Upload file(s) using multipart/form-data
 * @param {string} url - Request URL
 * @param {FormData|object} data - File data
 * @param {object} config - Axios config
 * @returns {Promise} Response promise
 */
export const upload = (url, data, config = {}) => {
    const formData = data instanceof FormData ? data : new FormData();

    if (!(data instanceof FormData)) {
        Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
        });
    }

    return api.post(url, formData, {
        ...config,
        headers: {
            'Content-Type': 'multipart/form-data',
            ...config.headers,
        },
    });
};

export default api;
