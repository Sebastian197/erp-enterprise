/**
 * Router Guards
 * Handle authentication, authorization, and route protection
 */

import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import { useLocaleStore } from '@/stores/locale';

/**
 * Before each route navigation guard
 * @param {object} to - Target route
 * @param {object} from - Current route
 * @param {Function} next - Next function
 */
export const beforeEachGuard = async (to, from, next) => {
    const authStore = useAuthStore();
    const themeStore = useThemeStore();
    const localeStore = useLocaleStore();

    // Set page title
    document.title = to.meta.title
        ? `${to.meta.title} - ${import.meta.env.VITE_APP_NAME || 'ERP Enterprise'}`
        : import.meta.env.VITE_APP_NAME || 'ERP Enterprise';

    // Apply theme and locale
    themeStore.applyTheme(themeStore.currentTheme);
    localeStore.applyLocale(localeStore.currentLocale);

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
        if (!authStore.isAuthenticated) {
            // Redirect to login with return URL
            return next({
                name: 'login',
                query: { redirect: to.fullPath },
            });
        }

        // Check if user data needs to be fetched
        if (!authStore.user) {
            try {
                await authStore.fetchUser();
            } catch (error) {
                // If fetch fails, redirect to login
                return next({
                    name: 'login',
                    query: { redirect: to.fullPath },
                });
            }
        }

        // Check roles if specified
        if (to.meta.roles && to.meta.roles.length > 0) {
            const hasRole = authStore.hasRole(to.meta.roles);
            if (!hasRole) {
                return next({ name: 'forbidden' });
            }
        }

        // Check permissions if specified
        if (to.meta.permissions && to.meta.permissions.length > 0) {
            const hasPermission = authStore.hasPermission(to.meta.permissions);
            if (!hasPermission) {
                return next({ name: 'forbidden' });
            }
        }
    }

    // Redirect authenticated users away from guest pages
    if (to.meta.guest && authStore.isAuthenticated) {
        return next({ name: 'dashboard' });
    }

    next();
};

/**
 * After each route navigation guard
 * @param {object} to - Target route
 * @param {object} from - Current route
 */
export const afterEachGuard = (to, from) => {
    // Scroll to top on route change
    if (to.path !== from.path) {
        window.scrollTo(0, 0);
    }

    // Track page view (e.g., analytics)
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', import.meta.env.VITE_GA_TRACKING_ID, {
            page_path: to.path,
        });
    }
};

/**
 * Error handler for navigation errors
 * @param {Error} error - Navigation error
 */
export const errorHandler = (error) => {
    console.error('Navigation error:', error);
};

export default {
    beforeEachGuard,
    afterEachGuard,
    errorHandler,
};
