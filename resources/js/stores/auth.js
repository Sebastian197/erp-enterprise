/**
 * Authentication Store
 * Manages user authentication state, login, logout, and user data
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';
import { API_ENDPOINTS, STORAGE_KEYS } from '@/utils/constants';
import { setI18nLocale } from '@/i18n';

export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref(null);
    const token = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Getters
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    const currentUser = computed(() => user.value);
    const userRoles = computed(() => user.value?.roles || []);
    const userPermissions = computed(() => user.value?.permissions || []);
    const userName = computed(() => user.value?.name || '');
    const userEmail = computed(() => user.value?.email || '');
    const userAvatar = computed(() => user.value?.avatar || null);

    /**
     * Initialize auth from localStorage
     */
    const init = () => {
        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

        if (storedToken && storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            token.value = storedToken;
            try {
                user.value = JSON.parse(storedUser);
            } catch (e) {
                console.error('Failed to parse stored user:', e);
                clearAuth();
            }
        } else if (storedToken || storedUser) {
            // Clear invalid data
            clearAuth();
        }
    };

    /**
     * Login user
     * @param {object} credentials - User credentials (email, password)
     * @returns {Promise<object>} User data
     */
    const login = async (credentials) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

            const { token: authToken, user: userData } = response.data.data;

            // Store auth data
            token.value = authToken;
            user.value = userData;

            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(userData));

            // Clear welcome animation flag so it shows on first dashboard visit after login
            sessionStorage.removeItem('dashboard_welcome_shown');

            // Fetch and apply user preferences (locale, theme, etc.)
            await fetchAndApplyPreferences();

            return userData;
        } catch (err) {
            error.value = err.message || 'Login failed';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Register new user
     * @param {object} userData - User registration data
     * @returns {Promise<object>} User data
     */
    const register = async (userData) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);

            const { token: authToken, user: newUser } = response.data;

            // Store auth data
            token.value = authToken;
            user.value = newUser;

            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));

            return newUser;
        } catch (err) {
            error.value = err.message || 'Registration failed';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Logout user
     */
    const logout = async () => {
        try {
            loading.value = true;

            // Call logout endpoint
            await api.post(API_ENDPOINTS.AUTH.LOGOUT);
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            // Clear auth regardless of API call result
            clearAuth();
            loading.value = false;
        }
    };

    /**
     * Fetch current user data
     * @returns {Promise<object>} User data
     */
    const fetchUser = async () => {
        try {
            loading.value = true;
            error.value = null;

            const response = await api.get(API_ENDPOINTS.AUTH.ME);
            user.value = response.data.data;

            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data.data));

            return response.data.data;
        } catch (err) {
            error.value = err.message || 'Failed to fetch user';
            if (err.status === 401) {
                clearAuth();
            }
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update user profile
     * @param {object} profileData - Profile data to update
     * @returns {Promise<object>} Updated user data
     */
    const updateProfile = async (profileData) => {
        try {
            loading.value = true;
            error.value = null;

            const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, profileData);
            user.value = response.data;

            localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.data));

            return response.data;
        } catch (err) {
            error.value = err.message || 'Failed to update profile';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update user password
     * @param {object} passwordData - Password data (current_password, new_password, new_password_confirmation)
     * @returns {Promise<void>}
     */
    const updatePassword = async (passwordData) => {
        try {
            loading.value = true;
            error.value = null;

            await api.put(API_ENDPOINTS.PROFILE.PASSWORD, passwordData);
        } catch (err) {
            error.value = err.message || 'Failed to update password';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update user avatar
     * @param {File} file - Avatar file
     * @returns {Promise<string>} Avatar URL
     */
    const updateAvatar = async (file) => {
        try {
            loading.value = true;
            error.value = null;

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post(API_ENDPOINTS.PROFILE.AVATAR, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Update user with new avatar
            if (user.value) {
                user.value.avatar = response.data.avatar;
                localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user.value));
            }

            return response.data.avatar;
        } catch (err) {
            error.value = err.message || 'Failed to update avatar';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Send password reset email
     * @param {string} email - User email
     * @returns {Promise<void>}
     */
    const forgotPassword = async (email) => {
        try {
            loading.value = true;
            error.value = null;

            await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        } catch (err) {
            error.value = err.message || 'Failed to send reset email';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Reset password with token
     * @param {object} resetData - Reset data (token, email, password, password_confirmation)
     * @returns {Promise<void>}
     */
    const resetPassword = async (resetData) => {
        try {
            loading.value = true;
            error.value = null;

            await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, resetData);
        } catch (err) {
            error.value = err.message || 'Failed to reset password';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Check if user has specific role
     * @param {string|string[]} roles - Role(s) to check
     * @returns {boolean} True if user has role
     */
    const hasRole = (roles) => {
        if (!user.value) return false;

        const userRoleNames = userRoles.value.map(role => role.name);
        const rolesToCheck = Array.isArray(roles) ? roles : [roles];

        return rolesToCheck.some(role => userRoleNames.includes(role));
    };

    /**
     * Check if user has specific permission
     * Replicates backend Gate::before() logic:
     * 1. Super Admin has access to everything
     * 2. Privileged groups (Administradores, Webmaster) have access unless explicitly denied
     * 3. Regular users need the permission in their permissions array
     *
     * @param {string|string[]} permissions - Permission(s) to check
     * @returns {boolean} True if user has permission
     */
    const hasPermission = (permissions) => {
        if (!user.value) return false;

        const permsToCheck = Array.isArray(permissions) ? permissions : [permissions];

        // 1. Super Admin bypass - full access to everything
        if (hasRole('Super Admin')) {
            return true;
        }

        // 2. Privileged groups system
        const privilegedGroups = ['Administradores', 'Webmaster'];
        const userGroupName = user.value.group?.name;

        if (userGroupName && privilegedGroups.includes(userGroupName)) {
            // Check if any of the requested permissions are explicitly denied
            const hasExplicitDeny = permsToCheck.some(permName => {
                return userPermissions.value.some(perm =>
                    perm.name === permName && perm.pivot?.is_negative === true
                );
            });

            if (hasExplicitDeny) {
                return false; // Explicitly denied
            }

            return true; // Granted by privileged group
        }

        // 3. Regular permission check
        const userPermissionNames = userPermissions.value.map(perm => perm.name);
        return permsToCheck.some(perm => userPermissionNames.includes(perm));
    };

    /**
     * Check if user can perform action (checks both roles and permissions)
     * @param {string|string[]} roleOrPermission - Role(s) or permission(s) to check
     * @returns {boolean} True if user can perform action
     */
    const can = (roleOrPermission) => {
        return hasRole(roleOrPermission) || hasPermission(roleOrPermission);
    };

    /**
     * Clear authentication data
     */
    const clearAuth = () => {
        user.value = null;
        token.value = null;
        error.value = null;

        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);

        // Clear welcome animation flag so it shows again on next login
        sessionStorage.removeItem('dashboard_welcome_shown');
    };

    /**
     * Refresh auth token
     * @returns {Promise<string>} New token
     */
    const refreshToken = async () => {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.REFRESH);
            const newToken = response.data.token;

            token.value = newToken;
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);

            return newToken;
        } catch (err) {
            clearAuth();
            throw err;
        }
    };

    /**
     * Fetch and apply user preferences (locale, theme, etc.)
     * @returns {Promise<object>} User preferences
     */
    const fetchAndApplyPreferences = async () => {
        try {
            // Check if there's a locale in localStorage (user might have changed it before login)
            const localStorageLocale = localStorage.getItem(STORAGE_KEYS.LOCALE);

            const response = await api.get(API_ENDPOINTS.PREFERENCES.SHOW);
            const preferences = response.data.data;

            // Determine which locale to use
            let localeToApply = preferences?.locale || 'en';

            // If localStorage has a different locale than backend,
            // prefer localStorage (it's the most recent user choice) and update backend
            if (localStorageLocale && localStorageLocale !== localeToApply) {
                try {
                    await api.put(API_ENDPOINTS.PREFERENCES.LOCALE, {
                        locale: localStorageLocale,
                    });
                    localeToApply = localStorageLocale;
                } catch (updateErr) {
                    console.error('Failed to update backend with localStorage locale:', updateErr);
                }
            }

            // Apply locale preference
            if (localeToApply) {
                await setI18nLocale(localeToApply);
                localStorage.setItem(STORAGE_KEYS.LOCALE, localeToApply);
            }

            // Apply theme preference if exists
            if (preferences && preferences.theme) {
                try {
                    const { useThemeStore } = await import('@/stores/theme');
                    const themeStore = useThemeStore();

                    // Get theme identifier from backend response
                    // Backend should return theme object with 'identifier' field (e.g., 'default-light')
                    const themeIdentifier = preferences.theme.identifier || preferences.theme;

                    // Apply theme without syncing back to backend (avoid circular call)
                    if (themeIdentifier) {
                        await themeStore.setTheme(themeIdentifier, false);
                    }
                } catch (themeErr) {
                    console.error('Failed to apply theme preference:', themeErr);
                    // Continue anyway - theme is optional
                }
            }

            return preferences;
        } catch (err) {
            console.error('Failed to fetch user preferences:', err);
            // Don't throw error - preferences are optional
            return null;
        }
    };

    // Initialize on store creation
    init();

    return {
        // State
        user,
        token,
        loading,
        error,

        // Getters
        isAuthenticated,
        currentUser,
        userRoles,
        userPermissions,
        userName,
        userEmail,
        userAvatar,

        // Actions
        login,
        register,
        logout,
        fetchUser,
        updateProfile,
        updatePassword,
        updateAvatar,
        forgotPassword,
        resetPassword,
        hasRole,
        hasPermission,
        can,
        clearAuth,
        refreshToken,
        fetchAndApplyPreferences,
    };
}, {
    persist: {
        key: 'auth-store',
        storage: localStorage,
        paths: ['user', 'token'],
    },
});
