/**
 * Locale Composable
 * Provides internationalization functionality to components
 */

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocaleStore } from '@/stores/locale';

export function useLocale() {
    const { t, locale, availableLocales: i18nLocales } = useI18n();
    const localeStore = useLocaleStore();

    /**
     * Get current locale
     */
    const currentLocale = computed(() => localeStore.currentLocale);

    /**
     * Get available locales
     */
    const availableLocales = computed(() => localeStore.availableLocales);

    /**
     * Check if RTL
     */
    const isRTL = computed(() => localeStore.isRTL);

    /**
     * Get locale metadata
     */
    const localeMetadata = computed(() => localeStore.localeMetadata);

    /**
     * Get loading state
     */
    const loading = computed(() => localeStore.loading);

    /**
     * Set locale
     * @param {string} newLocale - Locale code
     * @returns {Promise<void>}
     */
    const setLocale = async (newLocale) => {
        try {
            await localeStore.setLocale(newLocale);
            locale.value = newLocale;
        } catch (err) {
            console.error('Failed to set locale:', err);
            throw err;
        }
    };

    /**
     * Get current locale code
     * @returns {string}
     */
    const getCurrentLocale = () => {
        return localeStore.currentLocale;
    };

    /**
     * Translate key
     * @param {string} key - Translation key
     * @param {object} params - Translation parameters
     * @returns {string}
     */
    const translate = (key, params = {}) => {
        return t(key, params);
    };

    /**
     * Get locale by code
     * @param {string} code - Locale code
     * @returns {object|null}
     */
    const getLocaleByCode = (code) => {
        return localeStore.getLocaleByCode(code);
    };

    /**
     * Get locale name
     * @param {string} code - Locale code (optional)
     * @returns {string}
     */
    const getLocaleName = (code = null) => {
        return localeStore.getLocaleName(code);
    };

    /**
     * Get locale flag
     * @param {string} code - Locale code (optional)
     * @returns {string}
     */
    const getLocaleFlag = (code = null) => {
        return localeStore.getLocaleFlag(code);
    };

    /**
     * Format date
     * @param {Date|string} date - Date to format
     * @param {object} options - Format options
     * @returns {string}
     */
    const formatDate = (date, options = {}) => {
        return localeStore.formatDate(date, options);
    };

    /**
     * Format number
     * @param {number} number - Number to format
     * @param {object} options - Format options
     * @returns {string}
     */
    const formatNumber = (number, options = {}) => {
        return localeStore.formatNumber(number, options);
    };

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     * @param {object} options - Format options
     * @returns {string}
     */
    const formatCurrency = (amount, currency = 'USD', options = {}) => {
        return localeStore.formatCurrency(amount, currency, options);
    };

    /**
     * Get relative time
     * @param {Date|string} date - Date
     * @returns {string}
     */
    const getRelativeTime = (date) => {
        return localeStore.getRelativeTime(date);
    };

    /**
     * Preload locales
     * @param {string[]} locales - Locale codes
     * @returns {Promise<void>}
     */
    const preloadLocales = async (locales) => {
        await localeStore.preloadLocales(locales);
    };

    return {
        // State
        currentLocale,
        availableLocales,
        isRTL,
        localeMetadata,
        loading,

        // Methods
        setLocale,
        getCurrentLocale,
        translate,
        t: translate, // Alias
        getLocaleByCode,
        getLocaleName,
        getLocaleFlag,
        formatDate,
        formatNumber,
        formatCurrency,
        getRelativeTime,
        preloadLocales,
    };
}
