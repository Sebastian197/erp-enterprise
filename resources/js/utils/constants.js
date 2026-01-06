/**
 * Application constants and configuration values
 */

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH: '/auth/refresh',
        ME: '/auth/user',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },
    USERS: {
        INDEX: '/users',
        STORE: '/users',
        SHOW: (id) => `/users/${id}`,
        UPDATE: (id) => `/users/${id}`,
        DESTROY: (id) => `/users/${id}`,
        RESTORE: (id) => `/users/${id}/restore`,
    },
    PROFILE: {
        SHOW: '/profile',
        UPDATE: '/profile',
        PASSWORD: '/profile/password',
        AVATAR: '/profile/avatar',
    },
    PREFERENCES: {
        SHOW: '/preferences',
        UPDATE: '/preferences',
        LOCALE: '/preferences/locale',
        THEME: '/preferences/theme',
    },
    GROUPS: {
        INDEX: '/groups',
        STORE: '/groups',
        SHOW: (id) => `/groups/${id}`,
        UPDATE: (id) => `/groups/${id}`,
        DESTROY: (id) => `/groups/${id}`,
    },
    ROLES: {
        INDEX: '/roles',
        STORE: '/roles',
        SHOW: (id) => `/roles/${id}`,
        UPDATE: (id) => `/roles/${id}`,
        DESTROY: (id) => `/roles/${id}`,
    },
    PERMISSIONS: {
        INDEX: '/permissions',
    },
    CATEGORIES: {
        INDEX: '/categories',
        STORE: '/categories',
        SHOW: (id) => `/categories/${id}`,
        UPDATE: (id) => `/categories/${id}`,
        DESTROY: (id) => `/categories/${id}`,
    },
    THEMES: {
        INDEX: '/themes',
        STORE: '/themes',
        SHOW: (id) => `/themes/${id}`,
        UPDATE: (id) => `/themes/${id}`,
        DESTROY: (id) => `/themes/${id}`,
    },
    NOTIFICATIONS: {
        INDEX: '/notifications',
        MARK_READ: (id) => `/notifications/${id}/read`,
        MARK_ALL_READ: '/notifications/read-all',
        DESTROY: (id) => `/notifications/${id}`,
    },
};

/**
 * Available locales/languages
 */
export const LOCALES = {
    EN: { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
    ES: { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
    FR: { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
    DE: { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
    IT: { code: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
    PT: { code: 'pt', name: 'Português', flag: '🇵🇹', dir: 'ltr' },
    ZH: { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
    JA: { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
    AR: { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
    RU: { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
};

/**
 * Available themes
 */
export const THEMES = {
    DEFAULT_LIGHT: 'default-light',
    DEFAULT_DARK: 'default-dark',
    BLUE_OCEAN: 'blue-ocean',
    PURPLE_DREAM: 'purple-dream',
    GREEN_NATURE: 'green-nature',
    ORANGE_SUNSET: 'orange-sunset',
    RED_FIRE: 'red-fire',
    GRAY_PROFESSIONAL: 'gray-professional',
    TEAL_MODERN: 'teal-modern',
    PINK_SOFT: 'pink-soft',
    HIGH_CONTRAST: 'high-contrast',
    CUSTOM: 'custom',
};

/**
 * Theme metadata
 */
export const THEME_METADATA = {
    [THEMES.DEFAULT_LIGHT]: { name: 'Default Light', dark: false },
    [THEMES.DEFAULT_DARK]: { name: 'Default Dark', dark: true },
    [THEMES.BLUE_OCEAN]: { name: 'Blue Ocean', dark: false },
    [THEMES.PURPLE_DREAM]: { name: 'Purple Dream', dark: false },
    [THEMES.GREEN_NATURE]: { name: 'Green Nature', dark: false },
    [THEMES.ORANGE_SUNSET]: { name: 'Orange Sunset', dark: false },
    [THEMES.RED_FIRE]: { name: 'Red Fire', dark: false },
    [THEMES.GRAY_PROFESSIONAL]: { name: 'Gray Professional', dark: false },
    [THEMES.TEAL_MODERN]: { name: 'Teal Modern', dark: false },
    [THEMES.PINK_SOFT]: { name: 'Pink Soft', dark: false },
    [THEMES.HIGH_CONTRAST]: { name: 'High Contrast', dark: false },
    [THEMES.CUSTOM]: { name: 'Custom', dark: false },
};

/**
 * Theme ID mapping - maps frontend theme strings to backend numeric IDs
 * These IDs correspond to the themes table in the database
 */
export const THEME_ID_MAP = {
    'default-light': 1,
    'default-dark': 2,
    'blue-ocean': 3,
    'purple-dream': 4,
    'green-nature': 5,
    'orange-sunset': 6,
    'red-fire': 7,
    'gray-professional': 8,
    'teal-modern': 9,
    'pink-soft': 10,
    'high-contrast': 11,
    'custom': 12,
};

/**
 * User roles
 */
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user',
    GUEST: 'guest',
};

/**
 * Notification types
 */
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
};

/**
 * Notification duration (ms)
 */
export const NOTIFICATION_DURATION = {
    SHORT: 3000,
    MEDIUM: 5000,
    LONG: 7000,
    PERSISTENT: 0, // Don't auto-dismiss
};

/**
 * Pagination defaults
 */
export const PAGINATION = {
    PER_PAGE: 15,
    PER_PAGE_OPTIONS: [10, 15, 25, 50, 100],
};

/**
 * Date/time formats
 */
export const DATE_FORMATS = {
    DATE: 'YYYY-MM-DD',
    TIME: 'HH:mm:ss',
    DATETIME: 'YYYY-MM-DD HH:mm:ss',
    DISPLAY_DATE: 'MMM DD, YYYY',
    DISPLAY_DATETIME: 'MMM DD, YYYY HH:mm',
};

/**
 * File upload constraints
 */
export const UPLOAD = {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    AVATAR_MAX_SIZE: 2 * 1024 * 1024, // 2MB
};

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    AUTH_USER: 'auth_user',
    THEME: 'app_theme',
    LOCALE: 'app_locale',
    SIDEBAR_COLLAPSED: 'sidebar_collapsed',
};

/**
 * WebSocket events
 */
export const WEBSOCKET_EVENTS = {
    USER_CREATED: 'UserCreated',
    USER_UPDATED: 'UserUpdated',
    USER_DELETED: 'UserDeleted',
    USER_STATUS_CHANGED: 'UserStatusChanged',
    NOTIFICATION: 'NotificationCreated',
    SYSTEM_MESSAGE: 'SystemMessage',
};

/**
 * Application metadata
 */
export const APP = {
    NAME: import.meta.env.VITE_APP_NAME || 'ERP Enterprise',
    VERSION: '1.0.0',
    AUTHOR: 'ERP Enterprise Team',
    DESCRIPTION: 'Enterprise Resource Planning System',
};

/**
 * Validation rules
 */
export const VALIDATION = {
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^\+?[\d\s\-()]+$/,
};

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

export default {
    API_ENDPOINTS,
    LOCALES,
    THEMES,
    THEME_METADATA,
    ROLES,
    NOTIFICATION_TYPES,
    NOTIFICATION_DURATION,
    PAGINATION,
    DATE_FORMATS,
    UPLOAD,
    STORAGE_KEYS,
    WEBSOCKET_EVENTS,
    APP,
    VALIDATION,
    HTTP_STATUS,
};
