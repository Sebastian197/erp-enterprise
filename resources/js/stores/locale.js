/**
 * Locale Store
 * Manages application locale/language state and internationalization
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { LOCALES, STORAGE_KEYS } from '@/utils/constants';

export const useLocaleStore = defineStore('locale', () => {
    // State
    const currentLocale = ref('en');
    const loading = ref(false);
    const loadedLocales = ref(['en']); // Track loaded locale files

    // Available locales list
    const availableLocales = computed(() => {
        return Object.values(LOCALES);
    });

    // Current locale metadata
    const localeMetadata = computed(() => {
        return LOCALES[currentLocale.value.toUpperCase()] || LOCALES.EN;
    });

    // Check if current locale is RTL
    const isRTL = computed(() => {
        return localeMetadata.value.dir === 'rtl';
    });

    /**
     * Initialize locale from localStorage or browser
     */
    const init = () => {
        const storedLocale = localStorage.getItem(STORAGE_KEYS.LOCALE);

        if (storedLocale && isValidLocale(storedLocale)) {
            currentLocale.value = storedLocale;
        } else {
            // Detect browser language
            const browserLang = navigator.language.split('-')[0];
            if (isValidLocale(browserLang)) {
                currentLocale.value = browserLang;
            }
        }

        applyLocale(currentLocale.value);
    };

    /**
     * Check if locale is valid
     * @param {string} locale - Locale code
     * @returns {boolean} True if valid
     */
    const isValidLocale = (locale) => {
        return Object.keys(LOCALES).some(key => LOCALES[key].code === locale);
    };

    /**
     * Set locale
     * @param {string} locale - Locale code
     * @returns {Promise<void>}
     */
    const setLocale = async (locale) => {
        if (!isValidLocale(locale)) {
            console.error('Invalid locale:', locale);
            return;
        }

        try {
            loading.value = true;

            // Load locale messages if not already loaded
            if (!loadedLocales.value.includes(locale)) {
                await loadMessages(locale);
            }

            currentLocale.value = locale;
            localStorage.setItem(STORAGE_KEYS.LOCALE, locale);
            applyLocale(locale);
        } catch (error) {
            console.error('Failed to set locale:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Apply locale to DOM and vue-i18n
     * @param {string} locale - Locale code
     */
    const applyLocale = (locale) => {
        const html = document.documentElement;

        // Set lang attribute
        html.setAttribute('lang', locale);

        // Set dir attribute for RTL languages
        const localeData = Object.values(LOCALES).find(l => l.code === locale);
        if (localeData) {
            html.setAttribute('dir', localeData.dir);

            // Add/remove RTL class
            if (localeData.dir === 'rtl') {
                html.classList.add('rtl');
            } else {
                html.classList.remove('rtl');
            }
        }
    };

    /**
     * Load locale messages
     * @param {string} locale - Locale code
     * @returns {Promise<object>} Locale messages
     */
    const loadMessages = async (locale) => {
        try {
            // Dynamic import of locale file
            const messages = await import(`@/i18n/locales/${locale}.json`);

            // Mark as loaded
            if (!loadedLocales.value.includes(locale)) {
                loadedLocales.value.push(locale);
            }

            return messages.default || messages;
        } catch (error) {
            console.error(`Failed to load locale ${locale}:`, error);
            throw error;
        }
    };

    /**
     * Get locale by code
     * @param {string} code - Locale code
     * @returns {object|null} Locale object
     */
    const getLocaleByCode = (code) => {
        return availableLocales.value.find(l => l.code === code) || null;
    };

    /**
     * Get locale name
     * @param {string} code - Locale code (optional, defaults to current)
     * @returns {string} Locale name
     */
    const getLocaleName = (code = null) => {
        const locale = code ? getLocaleByCode(code) : localeMetadata.value;
        return locale ? locale.name : '';
    };

    /**
     * Get locale flag emoji
     * @param {string} code - Locale code (optional, defaults to current)
     * @returns {string} Flag emoji
     */
    const getLocaleFlag = (code = null) => {
        const locale = code ? getLocaleByCode(code) : localeMetadata.value;
        return locale ? locale.flag : '';
    };

    /**
     * Format date according to current locale
     * @param {Date|string} date - Date to format
     * @param {object} options - Intl.DateTimeFormat options
     * @returns {string} Formatted date
     */
    const formatDate = (date, options = {}) => {
        const d = date instanceof Date ? date : new Date(date);
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options,
        };

        return new Intl.DateTimeFormat(currentLocale.value, defaultOptions).format(d);
    };

    /**
     * Format number according to current locale
     * @param {number} number - Number to format
     * @param {object} options - Intl.NumberFormat options
     * @returns {string} Formatted number
     */
    const formatNumber = (number, options = {}) => {
        return new Intl.NumberFormat(currentLocale.value, options).format(number);
    };

    /**
     * Format currency according to current locale
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code (default: USD)
     * @param {object} options - Intl.NumberFormat options
     * @returns {string} Formatted currency
     */
    const formatCurrency = (amount, currency = 'USD', options = {}) => {
        return new Intl.NumberFormat(currentLocale.value, {
            style: 'currency',
            currency,
            ...options,
        }).format(amount);
    };

    /**
     * Get relative time string
     * @param {Date|string} date - Date to format
     * @returns {string} Relative time (e.g., "2 hours ago")
     */
    const getRelativeTime = (date) => {
        const d = date instanceof Date ? date : new Date(date);
        const now = new Date();
        const diffInSeconds = Math.floor((now - d) / 1000);

        const rtf = new Intl.RelativeTimeFormat(currentLocale.value, { numeric: 'auto' });

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };

        for (const [unit, seconds] of Object.entries(intervals)) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                return rtf.format(-interval, unit);
            }
        }

        return rtf.format(-diffInSeconds, 'second');
    };

    /**
     * Check if locale is loaded
     * @param {string} locale - Locale code
     * @returns {boolean} True if loaded
     */
    const isLocaleLoaded = (locale) => {
        return loadedLocales.value.includes(locale);
    };

    /**
     * Preload locales
     * @param {string[]} locales - Locale codes to preload
     * @returns {Promise<void>}
     */
    const preloadLocales = async (locales) => {
        const toLoad = locales.filter(locale => !isLocaleLoaded(locale));

        await Promise.all(
            toLoad.map(locale => loadMessages(locale))
        );
    };

    // Initialize on store creation
    init();

    return {
        // State
        currentLocale,
        loading,
        loadedLocales,

        // Getters
        availableLocales,
        localeMetadata,
        isRTL,

        // Actions
        setLocale,
        applyLocale,
        loadMessages,
        getLocaleByCode,
        getLocaleName,
        getLocaleFlag,
        formatDate,
        formatNumber,
        formatCurrency,
        getRelativeTime,
        isLocaleLoaded,
        preloadLocales,
    };
}, {
    persist: {
        key: 'locale-store',
        storage: localStorage,
        paths: ['currentLocale'],
    },
});
