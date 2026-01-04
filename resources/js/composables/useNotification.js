/**
 * Notification Composable
 * Provides notification functionality to components
 */

import { computed } from 'vue';
import { useNotificationStore } from '@/stores/notification';

export function useNotification() {
    const notificationStore = useNotificationStore();

    /**
     * Get all notifications
     */
    const notifications = computed(() => notificationStore.notifications);

    /**
     * Get active notifications
     */
    const activeNotifications = computed(() => notificationStore.activeNotifications);

    /**
     * Get sorted notifications
     */
    const sortedNotifications = computed(() => notificationStore.sortedNotifications);

    /**
     * Get unread count
     */
    const unreadCount = computed(() => notificationStore.unreadCount);

    /**
     * Check if has unread
     */
    const hasUnread = computed(() => notificationStore.hasUnread);

    /**
     * Get loading state
     */
    const loading = computed(() => notificationStore.loading);

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title
     * @param {object} options - Additional options
     * @returns {object}
     */
    const show = (message, title = 'Notification', options = {}) => {
        return notificationStore.notify(message, title, options);
    };

    /**
     * Show success notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title
     * @param {object} options - Additional options
     * @returns {object}
     */
    const success = (message, title = 'Success', options = {}) => {
        return notificationStore.success(message, title, options);
    };

    /**
     * Show error notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title
     * @param {object} options - Additional options
     * @returns {object}
     */
    const error = (message, title = 'Error', options = {}) => {
        return notificationStore.error(message, title, options);
    };

    /**
     * Show warning notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title
     * @param {object} options - Additional options
     * @returns {object}
     */
    const warning = (message, title = 'Warning', options = {}) => {
        return notificationStore.warning(message, title, options);
    };

    /**
     * Show info notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title
     * @param {object} options - Additional options
     * @returns {object}
     */
    const info = (message, title = 'Info', options = {}) => {
        return notificationStore.info(message, title, options);
    };

    /**
     * Dismiss notification
     * @param {number} id - Notification ID
     */
    const dismiss = (id) => {
        notificationStore.dismissNotification(id);
    };

    /**
     * Mark notification as read
     * @param {number} id - Notification ID
     */
    const markAsRead = (id) => {
        notificationStore.markAsRead(id);
    };

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = () => {
        notificationStore.markAllAsRead();
    };

    /**
     * Clear all notifications
     */
    const clearAll = () => {
        notificationStore.clearAll();
    };

    /**
     * Clear notification by ID
     * @param {number} id - Notification ID
     */
    const clear = (id) => {
        notificationStore.clear(id);
    };

    /**
     * Get notification by ID
     * @param {number} id - Notification ID
     * @returns {object|null}
     */
    const getById = (id) => {
        return notificationStore.getNotificationById(id);
    };

    /**
     * Request browser notification permission
     * @returns {Promise<string>}
     */
    const requestPermission = async () => {
        return await notificationStore.requestPermission();
    };

    /**
     * Add system notification (from WebSocket)
     * @param {object} data - Notification data
     * @returns {object}
     */
    const addSystemNotification = (data) => {
        return notificationStore.addSystemNotification(data);
    };

    return {
        // State
        notifications,
        activeNotifications,
        sortedNotifications,
        unreadCount,
        hasUnread,
        loading,

        // Methods
        show,
        success,
        error,
        warning,
        info,
        dismiss,
        markAsRead,
        markAllAsRead,
        clearAll,
        clear,
        getById,
        requestPermission,
        addSystemNotification,
    };
}