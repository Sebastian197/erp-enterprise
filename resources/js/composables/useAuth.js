/**
 * Authentication Composable
 * Provides authentication functionality to components
 */

import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
    const authStore = useAuthStore();
    const router = useRouter();

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = computed(() => authStore.isAuthenticated);

    /**
     * Get current user
     */
    const user = computed(() => authStore.currentUser);

    /**
     * Get loading state
     */
    const loading = computed(() => authStore.loading);

    /**
     * Get error state
     */
    const error = computed(() => authStore.error);

    /**
     * Login user
     * @param {object} credentials - User credentials
     * @returns {Promise<void>}
     */
    const login = async (credentials) => {
        try {
            await authStore.login(credentials);
            await router.push({ name: 'dashboard' });
        } catch (err) {
            throw err;
        }
    };

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    const logout = async () => {
        try {
            await authStore.logout();
            await router.push({ name: 'login' });
        } catch (err) {
            console.error('Logout error:', err);
            await router.push({ name: 'login' });
        }
    };

    /**
     * Register new user
     * @param {object} userData - User registration data
     * @returns {Promise<void>}
     */
    const register = async (userData) => {
        try {
            await authStore.register(userData);
            await router.push({ name: 'dashboard' });
        } catch (err) {
            throw err;
        }
    };

    /**
     * Fetch current user data
     * @returns {Promise<void>}
     */
    const fetchUser = async () => {
        try {
            await authStore.fetchUser();
        } catch (err) {
            throw err;
        }
    };

    /**
     * Update user profile
     * @param {object} profileData - Profile data
     * @returns {Promise<void>}
     */
    const updateProfile = async (profileData) => {
        try {
            await authStore.updateProfile(profileData);
        } catch (err) {
            throw err;
        }
    };

    /**
     * Update user password
     * @param {object} passwordData - Password data
     * @returns {Promise<void>}
     */
    const updatePassword = async (passwordData) => {
        try {
            await authStore.updatePassword(passwordData);
        } catch (err) {
            throw err;
        }
    };

    /**
     * Check if user has specific role
     * @param {string|string[]} roles - Role(s) to check
     * @returns {boolean}
     */
    const hasRole = (roles) => {
        return authStore.hasRole(roles);
    };

    /**
     * Check if user has specific permission
     * @param {string|string[]} permissions - Permission(s) to check
     * @returns {boolean}
     */
    const hasPermission = (permissions) => {
        return authStore.hasPermission(permissions);
    };

    /**
     * Check if user can perform action
     * @param {string|string[]} roleOrPermission - Role(s) or permission(s)
     * @returns {boolean}
     */
    const can = (roleOrPermission) => {
        return authStore.can(roleOrPermission);
    };

    /**
     * Check authentication status
     * @returns {boolean}
     */
    const checkAuth = () => {
        return authStore.isAuthenticated;
    };

    return {
        // State
        isAuthenticated,
        user,
        loading,
        error,

        // Methods
        login,
        logout,
        register,
        fetchUser,
        updateProfile,
        updatePassword,
        hasRole,
        hasPermission,
        can,
        checkAuth,
    };
}
