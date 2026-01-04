/**
 * Theme Composable
 * Provides theme management functionality to components
 */

import { computed } from 'vue';
import { useThemeStore } from '@/stores/theme';

export function useTheme() {
    const themeStore = useThemeStore();

    /**
     * Get current theme
     */
    const currentTheme = computed(() => themeStore.currentTheme);

    /**
     * Get available themes
     */
    const availableThemes = computed(() => themeStore.availableThemes);

    /**
     * Check if dark mode is enabled
     */
    const isDark = computed(() => themeStore.isDark);

    /**
     * Get theme metadata
     */
    const themeMetadata = computed(() => themeStore.themeMetadata);

    /**
     * Get loading state
     */
    const loading = computed(() => themeStore.loading);

    /**
     * Set theme
     * @param {string} theme - Theme ID
     */
    const setTheme = (theme) => {
        themeStore.setTheme(theme);
    };

    /**
     * Toggle dark mode
     */
    const toggleDarkMode = () => {
        themeStore.toggleDarkMode();
    };

    /**
     * Get current theme ID
     * @returns {string}
     */
    const getCurrentTheme = () => {
        return themeStore.currentTheme;
    };

    /**
     * Apply theme
     * @param {string} theme - Theme ID
     */
    const applyTheme = (theme) => {
        themeStore.applyTheme(theme);
    };

    /**
     * Set custom theme
     * @param {object} themeConfig - Custom theme configuration
     */
    const setCustomTheme = (themeConfig) => {
        themeStore.setCustomTheme(themeConfig);
    };

    /**
     * Reset to default theme
     */
    const resetTheme = () => {
        themeStore.resetTheme();
    };

    /**
     * Get theme by ID
     * @param {string} themeId - Theme ID
     * @returns {object|null}
     */
    const getThemeById = (themeId) => {
        return themeStore.getThemeById(themeId);
    };

    /**
     * Export current theme
     * @returns {object}
     */
    const exportTheme = () => {
        return themeStore.exportTheme();
    };

    /**
     * Import theme
     * @param {object} themeData - Theme data
     */
    const importTheme = (themeData) => {
        themeStore.importTheme(themeData);
    };

    return {
        // State
        currentTheme,
        availableThemes,
        isDark,
        themeMetadata,
        loading,

        // Methods
        setTheme,
        toggleDarkMode,
        getCurrentTheme,
        applyTheme,
        setCustomTheme,
        resetTheme,
        getThemeById,
        exportTheme,
        importTheme,
    };
}
