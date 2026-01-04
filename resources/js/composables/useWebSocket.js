/**
 * WebSocket Composable
 * Provides WebSocket functionality to components
 */

import { onMounted, onUnmounted, ref } from 'vue';
import {
    connect,
    disconnect,
    listen,
    listenPrivate,
    presence,
    leave,
    notifications,
    stopListening,
} from '@/utils/echo';
import { useAuthStore } from '@/stores/auth';
import { useNotificationStore } from '@/stores/notification';

export function useWebSocket() {
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const connected = ref(false);
    const listeners = ref([]);

    /**
     * Connect to WebSocket
     */
    const wsConnect = () => {
        if (!authStore.isAuthenticated) {
            console.warn('Cannot connect to WebSocket: user not authenticated');
            return;
        }

        try {
            connect();
            connected.value = true;
        } catch (err) {
            console.error('Failed to connect to WebSocket:', err);
            connected.value = false;
        }
    };

    /**
     * Disconnect from WebSocket
     */
    const wsDisconnect = () => {
        try {
            // Stop all listeners
            listeners.value.forEach(({ channel, event }) => {
                stopListening(channel, event);
            });
            listeners.value = [];

            disconnect();
            connected.value = false;
        } catch (err) {
            console.error('Failed to disconnect from WebSocket:', err);
        }
    };

    /**
     * Listen to public channel
     * @param {string} channel - Channel name
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     */
    const wsListen = (channel, event, callback) => {
        try {
            listen(channel, event, callback);
            listeners.value.push({ channel, event });
        } catch (err) {
            console.error('Failed to listen to channel:', err);
        }
    };

    /**
     * Listen to private channel
     * @param {string} channel - Channel name
     * @param {string} event - Event name
     * @param {Function} callback - Event callback
     */
    const wsListenPrivate = (channel, event, callback) => {
        try {
            listenPrivate(channel, event, callback);
            listeners.value.push({ channel, event });
        } catch (err) {
            console.error('Failed to listen to private channel:', err);
        }
    };

    /**
     * Join presence channel
     * @param {string} channel - Channel name
     * @returns {object} Channel with presence methods
     */
    const wsPresence = (channel) => {
        try {
            return presence(channel);
        } catch (err) {
            console.error('Failed to join presence channel:', err);
            return null;
        }
    };

    /**
     * Leave channel
     * @param {string} channel - Channel name
     */
    const wsLeave = (channel) => {
        try {
            leave(channel);
            // Remove from listeners
            listeners.value = listeners.value.filter(l => l.channel !== channel);
        } catch (err) {
            console.error('Failed to leave channel:', err);
        }
    };

    /**
     * Listen to notifications
     * @param {Function} callback - Notification callback
     */
    const wsNotifications = (callback) => {
        try {
            const defaultCallback = (notification) => {
                // Add to notification store
                notificationStore.addSystemNotification(notification);

                // Call custom callback if provided
                if (callback) {
                    callback(notification);
                }
            };

            notifications(defaultCallback);
        } catch (err) {
            console.error('Failed to listen to notifications:', err);
        }
    };

    /**
     * Stop listening to event
     * @param {string} channel - Channel name
     * @param {string} event - Event name
     */
    const wsStop = (channel, event) => {
        try {
            stopListening(channel, event);
            // Remove from listeners
            listeners.value = listeners.value.filter(
                l => !(l.channel === channel && l.event === event)
            );
        } catch (err) {
            console.error('Failed to stop listening:', err);
        }
    };

    /**
     * Auto-connect on mount if authenticated
     */
    onMounted(() => {
        if (authStore.isAuthenticated) {
            wsConnect();
        }
    });

    /**
     * Auto-disconnect on unmount
     */
    onUnmounted(() => {
        if (connected.value) {
            wsDisconnect();
        }
    });

    return {
        // State
        connected,
        listeners,

        // Methods
        connect: wsConnect,
        disconnect: wsDisconnect,
        listen: wsListen,
        listenPrivate: wsListenPrivate,
        presence: wsPresence,
        leave: wsLeave,
        notifications: wsNotifications,
        stop: wsStop,
    };
}