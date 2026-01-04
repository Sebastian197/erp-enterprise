/**
 * Notification Store
 * Manages application notifications (toast messages and system notifications)
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { NOTIFICATION_TYPES, NOTIFICATION_DURATION } from '@/utils/constants';

let notificationIdCounter = 0;

export const useNotificationStore = defineStore('notification', () => {
    // State
    const notifications = ref([]);
    const unreadCount = ref(0);
    const loading = ref(false);

    // Getters
    const activeNotifications = computed(() => {
        return notifications.value.filter(n => !n.dismissed);
    });

    const hasUnread = computed(() => unreadCount.value > 0);

    const sortedNotifications = computed(() => {
        return [...notifications.value].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
        });
    });

    /**
     * Add notification
     * @param {object} notification - Notification data
     * @returns {object} Created notification
     */
    const addNotification = (notification) => {
        const newNotification = {
            id: ++notificationIdCounter,
            type: notification.type || NOTIFICATION_TYPES.INFO,
            title: notification.title || '',
            message: notification.message || '',
            duration: notification.duration !== undefined ? notification.duration : NOTIFICATION_DURATION.MEDIUM,
            dismissible: notification.dismissible !== false,
            action: notification.action || null,
            icon: notification.icon || null,
            read: false,
            dismissed: false,
            created_at: new Date().toISOString(),
        };

        notifications.value.push(newNotification);

        // Auto-dismiss if duration is set
        if (newNotification.duration > 0) {
            setTimeout(() => {
                dismissNotification(newNotification.id);
            }, newNotification.duration);
        }

        return newNotification;
    };

    /**
     * Show success notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title (optional)
     * @param {object} options - Additional options
     * @returns {object} Created notification
     */
    const success = (message, title = 'Success', options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.SUCCESS,
            title,
            message,
            icon: 'fa-check-circle',
            ...options,
        });
    };

    /**
     * Show error notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title (optional)
     * @param {object} options - Additional options
     * @returns {object} Created notification
     */
    const error = (message, title = 'Error', options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.ERROR,
            title,
            message,
            icon: 'fa-exclamation-circle',
            duration: NOTIFICATION_DURATION.LONG,
            ...options,
        });
    };

    /**
     * Show warning notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title (optional)
     * @param {object} options - Additional options
     * @returns {object} Created notification
     */
    const warning = (message, title = 'Warning', options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.WARNING,
            title,
            message,
            icon: 'fa-exclamation-triangle',
            ...options,
        });
    };

    /**
     * Show info notification
     * @param {string} message - Notification message
     * @param {string} title - Notification title (optional)
     * @param {object} options - Additional options
     * @returns {object} Created notification
     */
    const info = (message, title = 'Info', options = {}) => {
        return addNotification({
            type: NOTIFICATION_TYPES.INFO,
            title,
            message,
            icon: 'fa-info-circle',
            ...options,
        });
    };

    /**
     * Dismiss notification
     * @param {number} id - Notification ID
     */
    const dismissNotification = (id) => {
        const notification = notifications.value.find(n => n.id === id);
        if (notification) {
            notification.dismissed = true;

            // Remove from array after animation
            setTimeout(() => {
                const index = notifications.value.findIndex(n => n.id === id);
                if (index > -1) {
                    notifications.value.splice(index, 1);
                }
            }, 300);
        }
    };

    /**
     * Mark notification as read
     * @param {number} id - Notification ID
     */
    const markAsRead = (id) => {
        const notification = notifications.value.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            if (unreadCount.value > 0) {
                unreadCount.value--;
            }
        }
    };

    /**
     * Mark all notifications as read
     */
    const markAllAsRead = () => {
        notifications.value.forEach(notification => {
            notification.read = true;
        });
        unreadCount.value = 0;
    };

    /**
     * Clear all notifications
     */
    const clearAll = () => {
        notifications.value.forEach(notification => {
            notification.dismissed = true;
        });

        setTimeout(() => {
            notifications.value = [];
            unreadCount.value = 0;
        }, 300);
    };

    /**
     * Clear notification by ID
     * @param {number} id - Notification ID
     */
    const clear = (id) => {
        dismissNotification(id);
    };

    /**
     * Get notification by ID
     * @param {number} id - Notification ID
     * @returns {object|null} Notification object
     */
    const getNotificationById = (id) => {
        return notifications.value.find(n => n.id === id) || null;
    };

    /**
     * Get notifications by type
     * @param {string} type - Notification type
     * @returns {Array} Notifications array
     */
    const getNotificationsByType = (type) => {
        return notifications.value.filter(n => n.type === type);
    };

    /**
     * Add system notification (from WebSocket)
     * @param {object} data - Notification data from server
     * @returns {object} Created notification
     */
    const addSystemNotification = (data) => {
        const notification = addNotification({
            type: data.type || NOTIFICATION_TYPES.INFO,
            title: data.title || 'System Notification',
            message: data.message,
            duration: NOTIFICATION_DURATION.PERSISTENT,
            dismissible: true,
            action: data.action || null,
            icon: data.icon || null,
        });

        unreadCount.value++;

        return notification;
    };

    /**
     * Request browser notification permission
     * @returns {Promise<string>} Permission status
     */
    const requestPermission = async () => {
        if (!('Notification' in window)) {
            console.warn('Browser notifications not supported');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    };

    /**
     * Show browser notification
     * @param {object} notification - Notification data
     */
    const showBrowserNotification = (notification) => {
        if (!('Notification' in window)) {
            return;
        }

        if (Notification.permission === 'granted') {
            const browserNotification = new Notification(notification.title || 'Notification', {
                body: notification.message,
                icon: notification.icon || '/favicon.ico',
                tag: `notification-${notification.id}`,
                requireInteraction: notification.duration === NOTIFICATION_DURATION.PERSISTENT,
            });

            browserNotification.onclick = () => {
                window.focus();
                if (notification.action && typeof notification.action.handler === 'function') {
                    notification.action.handler();
                }
                browserNotification.close();
            };
        }
    };

    /**
     * Play notification sound
     * @param {string} type - Notification type
     */
    const playNotificationSound = (type = NOTIFICATION_TYPES.INFO) => {
        // You can add custom sound files for different notification types
        const audio = new Audio(`/sounds/notification-${type}.mp3`);
        audio.volume = 0.5;
        audio.play().catch(err => {
            console.warn('Failed to play notification sound:', err);
        });
    };

    /**
     * Show notification with browser notification and sound
     * @param {string} message - Notification message
     * @param {string} title - Notification title
     * @param {object} options - Additional options
     * @returns {object} Created notification
     */
    const notify = (message, title = 'Notification', options = {}) => {
        const notification = addNotification({
            title,
            message,
            ...options,
        });

        // Show browser notification if enabled
        if (options.browser !== false) {
            showBrowserNotification(notification);
        }

        // Play sound if enabled
        if (options.sound !== false) {
            playNotificationSound(notification.type);
        }

        return notification;
    };

    return {
        // State
        notifications,
        unreadCount,
        loading,

        // Getters
        activeNotifications,
        hasUnread,
        sortedNotifications,

        // Actions
        addNotification,
        success,
        error,
        warning,
        info,
        dismissNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        clear,
        getNotificationById,
        getNotificationsByType,
        addSystemNotification,
        requestPermission,
        showBrowserNotification,
        playNotificationSound,
        notify,
    };
});
