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
     * @param {string} theme - Theme ID
     */
    const setTheme = (theme) => {
        if (!Object.values(THEMES).includes(theme)) {
            console.error('Invalid theme:', theme);
            return;
        }

        currentTheme.value = theme;
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
        applyTheme(theme);
    };

    /**
     * Apply theme to DOM
     * @param {string} theme - Theme ID
     */
    const applyTheme = (theme) => {
        const html = document.documentElement;

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
    };

    /**
     * Load theme CSS file
     * @param {string} theme - Theme ID
     */
    const loadThemeCSS = (theme) => {
        // Remove existing theme link
        const existingLink = document.querySelector('link[data-theme-css]');
        if (existingLink) {
            existingLink.remove();
        }

        // Add new theme link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `/resources/js/styles/themes/${theme}.css`;
        link.setAttribute('data-theme-css', 'true');
        document.head.appendChild(link);
    };

    /**
     * Toggle dark mode
     */
    const toggleDarkMode = () => {
        const newTheme = isDark.value ? THEMES.DEFAULT_LIGHT : THEMES.DEFAULT_DARK;
        setTheme(newTheme);
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
