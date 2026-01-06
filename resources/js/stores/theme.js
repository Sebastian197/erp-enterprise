/**
 * Theme Store
 * Manages application theme state and theme switching
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { THEMES, THEME_METADATA, STORAGE_KEYS } from '@/utils/constants';

export const useThemeStore = defineStore('theme', () => {
    // State
    const currentTheme = ref(THEMES.DEFAULT_LIGHT);
    const customTheme = ref(null);
    const loading = ref(false);

    // Available themes list
    const availableThemes = computed(() => {
        return Object.keys(THEMES).map(key => ({
            id: THEMES[key],
            name: THEME_METADATA[THEMES[key]].name,
            dark: THEME_METADATA[THEMES[key]].dark,
        }));
    });

    // Current theme metadata
    const themeMetadata = computed(() => {
        return THEME_METADATA[currentTheme.value] || THEME_METADATA[THEMES.DEFAULT_LIGHT];
    });

    // Check if current theme is dark
    const isDark = computed(() => {
        return themeMetadata.value.dark;
    });

    /**
     * Initialize theme from localStorage
     */
    const init = () => {
        // Add no-transition class to prevent flash on initial load
        document.documentElement.classList.add('no-theme-transition');

        const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
        if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
            currentTheme.value = storedTheme;
            applyTheme(storedTheme);
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                currentTheme.value = THEMES.DEFAULT_DARK;
                applyTheme(THEMES.DEFAULT_DARK);
            }
        }

        // Remove no-transition class after brief delay
        setTimeout(() => {
            document.documentElement.classList.remove('no-theme-transition');
        }, 100);

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
                    const newTheme = e.matches ? THEMES.DEFAULT_DARK : THEMES.DEFAULT_LIGHT;
                    setTheme(newTheme);
                }
            });
        }
    };

    /**
     * Set theme
     * @param {string|object} theme - Theme ID or theme object from backend
     * @param {boolean} syncToBackend - Whether to sync to backend (default: true)
     */
    const setTheme = async (theme, syncToBackend = true) => {
        // Handle theme object from backend (extract slug)
        const themeSlug = typeof theme === 'object' && theme !== null ? theme.slug : theme;

        if (!Object.values(THEMES).includes(themeSlug)) {
            console.error('Invalid theme:', theme);
            return;
        }

        currentTheme.value = themeSlug;
        localStorage.setItem(STORAGE_KEYS.THEME, themeSlug);
        applyTheme(themeSlug);

        // Sync to backend if user is authenticated
        if (syncToBackend) {
            await syncThemeToBackend(themeSlug);
        }
    };

    /**
     * Sync theme to backend
     * @param {string} theme - Theme ID
     */
    const syncThemeToBackend = async (theme) => {
        try {
            // Check if user is authenticated
            const hasToken = !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
            if (!hasToken) {
                return; // Skip backend sync for non-authenticated users
            }

            // Get numeric theme_id from mapping
            const { THEME_ID_MAP } = await import('@/utils/constants');
            const themeId = THEME_ID_MAP[theme];
            if (!themeId) {
                console.warn('Theme ID mapping not found for:', theme);
                return;
            }

            // Import API dynamically to avoid circular dependency
            const { default: api } = await import('@/utils/api');
            const { API_ENDPOINTS } = await import('@/utils/constants');

            await api.put(API_ENDPOINTS.PREFERENCES.THEME, {
                theme_id: themeId,
            });
        } catch (error) {
            console.error('Failed to save theme preference to backend:', error);
            // Don't throw - localStorage is already updated, backend sync is optional enhancement
        }
    };

    /**
     * Apply theme to DOM
     * @param {string} theme - Theme ID
     */
    const applyTheme = (theme) => {
        const html = document.documentElement;

        // Add will-change hint for better performance
        html.style.willChange = 'background-color, color';

        // Remove all theme classes
        Object.values(THEMES).forEach(t => {
            html.classList.remove(`theme-${t}`);
        });

        // Add current theme class
        html.classList.add(`theme-${theme}`);

        // Add dark mode class if applicable
        if (THEME_METADATA[theme].dark) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }

        // Set data attribute for CSS
        html.setAttribute('data-theme', theme);

        // Load theme CSS file dynamically
        loadThemeCSS(theme);

        // Remove will-change hint after transition completes
        setTimeout(() => {
            html.style.willChange = '';
        }, 350);
    };

    /**
     * Load theme CSS file
     * @param {string} theme - Theme ID
     */
    const loadThemeCSS = (theme) => {
        // Apply theme colors via CSS variables
        // Theme colors come from the backend and are applied dynamically
        // No need to load separate CSS files
        if (customTheme.value && customTheme.value.colors) {
            applyThemeColors(customTheme.value.colors);
        }
    };

    /**
     * Apply theme colors to document root
     */
    const applyThemeColors = (colors) => {
        const root = document.documentElement;
        if (colors) {
            Object.entries(colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
        }
    };

    /**
     * Toggle dark mode
     */
    const toggleDarkMode = async () => {
        const newTheme = isDark.value ? THEMES.DEFAULT_LIGHT : THEMES.DEFAULT_DARK;
        await setTheme(newTheme);
    };

    /**
     * Set custom theme
     * @param {object} themeConfig - Custom theme configuration
     */
    const setCustomTheme = (themeConfig) => {
        customTheme.value = themeConfig;
        currentTheme.value = THEMES.CUSTOM;

        // Apply custom theme CSS variables
        const html = document.documentElement;
        Object.keys(themeConfig).forEach(key => {
            html.style.setProperty(`--${key}`, themeConfig[key]);
        });

        localStorage.setItem(STORAGE_KEYS.THEME, THEMES.CUSTOM);
        localStorage.setItem('custom_theme_config', JSON.stringify(themeConfig));
    };

    /**
     * Load custom theme from localStorage
     */
    const loadCustomTheme = () => {
        const storedConfig = localStorage.getItem('custom_theme_config');
        if (storedConfig) {
            try {
                customTheme.value = JSON.parse(storedConfig);
                return customTheme.value;
            } catch (e) {
                console.error('Failed to parse custom theme:', e);
            }
        }
        return null;
    };

    /**
     * Reset to default theme
     */
    const resetTheme = () => {
        customTheme.value = null;
        localStorage.removeItem('custom_theme_config');
        setTheme(THEMES.DEFAULT_LIGHT);
    };

    /**
     * Get theme by ID
     * @param {string} themeId - Theme ID
     * @returns {object|null} Theme object
     */
    const getThemeById = (themeId) => {
        return availableThemes.value.find(t => t.id === themeId) || null;
    };

    /**
     * Export current theme configuration
     * @returns {object} Theme configuration
     */
    const exportTheme = () => {
        if (currentTheme.value === THEMES.CUSTOM && customTheme.value) {
            return {
                id: THEMES.CUSTOM,
                config: customTheme.value,
            };
        }

        return {
            id: currentTheme.value,
            name: themeMetadata.value.name,
            dark: themeMetadata.value.dark,
        };
    };

    /**
     * Import theme configuration
     * @param {object} themeData - Theme data to import
     */
    const importTheme = (themeData) => {
        if (themeData.id === THEMES.CUSTOM && themeData.config) {
            setCustomTheme(themeData.config);
        } else if (Object.values(THEMES).includes(themeData.id)) {
            setTheme(themeData.id);
        }
    };

    // Initialize on store creation
    init();

    return {
        // State
        currentTheme,
        customTheme,
        loading,

        // Getters
        availableThemes,
        themeMetadata,
        isDark,

        // Actions
        setTheme,
        applyTheme,
        syncThemeToBackend,
        toggleDarkMode,
        setCustomTheme,
        loadCustomTheme,
        resetTheme,
        getThemeById,
        exportTheme,
        importTheme,
    };
}, {
    persist: {
        key: 'theme-store',
        storage: localStorage,
        paths: ['currentTheme', 'customTheme'],
    },
});
