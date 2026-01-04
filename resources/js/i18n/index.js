/**
 * Vue I18n Configuration
 * Handles internationalization and localization
 */

import { createI18n } from 'vue-i18n';
import { LOCALES } from '@/utils/constants';

/**
 * Load locale messages
 * Messages are lazy-loaded for better performance
 */
const messages = {
    en: () => import('./locales/en.json'),
    es: () => import('./locales/es.json'),
    fr: () => import('./locales/fr.json'),
    de: () => import('./locales/de.json'),
    it: () => import('./locales/it.json'),
    pt: () => import('./locales/pt.json'),
    zh: () => import('./locales/zh.json'),
    ja: () => import('./locales/ja.json'),
    ar: () => import('./locales/ar.json'),
    ru: () => import('./locales/ru.json'),
};

/**
 * Get default locale from browser or storage
 */
const getDefaultLocale = () => {
    const stored = localStorage.getItem('app_locale');
    if (stored && Object.keys(LOCALES).some(key => LOCALES[key].code === stored)) {
        return stored;
    }

    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(LOCALES).some(key => LOCALES[key].code === browserLang)) {
        return browserLang;
    }

    return 'en';
};

/**
 * Load initial locale synchronously
 */
const defaultLocale = getDefaultLocale();
const initialMessages = await import(`./locales/${defaultLocale}.json`);

/**
 * Create i18n instance
 */
const i18n = createI18n({
    legacy: false,
    locale: defaultLocale,
    fallbackLocale: 'en',
    messages: {
        [defaultLocale]: initialMessages.default || initialMessages,
    },
    globalInjection: true,
    missingWarn: false,
    fallbackWarn: false,
    silentTranslationWarn: true,
    silentFallbackWarn: true,
    datetimeFormats: {
        en: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
        es: {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            },
            long: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: 'numeric',
                minute: 'numeric',
            },
        },
        // Add more locale-specific formats as needed
    },
    numberFormats: {
        en: {
            currency: {
                style: 'currency',
                currency: 'USD',
            },
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
        es: {
            currency: {
                style: 'currency',
                currency: 'EUR',
            },
            decimal: {
                style: 'decimal',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        },
        // Add more locale-specific formats as needed
    },
});

/**
 * Load locale messages dynamically
 * @param {string} locale - Locale code
 * @returns {Promise} Promise that resolves when messages are loaded
 */
export async function loadLocaleMessages(locale) {
    // Check if locale messages are already loaded
    if (i18n.global.availableLocales.includes(locale)) {
        return;
    }

    // Load messages
    const messages = await import(`./locales/${locale}.json`);
    i18n.global.setLocaleMessage(locale, messages.default || messages);
}

/**
 * Set i18n locale
 * @param {string} locale - Locale code
 * @returns {Promise} Promise that resolves when locale is set
 */
export async function setI18nLocale(locale) {
    // Load messages if not already loaded
    await loadLocaleMessages(locale);

    // Set locale
    i18n.global.locale.value = locale;

    // Set HTML lang attribute
    document.querySelector('html').setAttribute('lang', locale);

    // Set dir attribute for RTL languages
    const localeData = Object.values(LOCALES).find(l => l.code === locale);
    if (localeData) {
        document.querySelector('html').setAttribute('dir', localeData.dir);
    }
}

export default i18n;
