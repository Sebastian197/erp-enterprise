/**
 * Laravel Echo configuration for real-time WebSocket communication
 * Uses Reverb (Laravel's WebSocket server) for broadcasting
 */

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

/**
 * Initialize Laravel Echo instance
 * @type {Echo|null}
 */
let echoInstance = null;

/**
 * Get or create Echo instance
 * @returns {Echo} Echo instance
 */
export const getEcho = () => {
    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY || 'local',
            wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
            wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
            wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
            enabledTransports: ['ws', 'wss'],
            authEndpoint: '/broadcasting/auth',
            auth: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    Accept: 'application/json',
                },
            },
        });
    }

    return echoInstance;
};

/**
 * Connect to Echo server
 * @returns {Echo} Echo instance
 */
export const connect = () => {
    return getEcho();
};

/**
 * Disconnect from Echo server
 */
export const disconnect = () => {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
    }
};

/**
 * Listen to a channel
 * @param {string} channel - Channel name
 * @param {string} event - Event name
 * @param {Function} callback - Event callback
 * @returns {object} Channel instance
 */
export const listen = (channel, event, callback) => {
    const echo = getEcho();
    return echo.channel(channel).listen(event, callback);
};

/**
 * Listen to a private channel
 * @param {string} channel - Channel name
 * @param {string} event - Event name
 * @param {Function} callback - Event callback
 * @returns {object} Channel instance
 */
export const listenPrivate = (channel, event, callback) => {
    const echo = getEcho();
    return echo.private(channel).listen(event, callback);
};

/**
 * Listen to a presence channel
 * @param {string} channel - Channel name
 * @returns {object} Channel instance with presence methods
 */
export const presence = (channel) => {
    const echo = getEcho();
    return echo.join(channel);
};

/**
 * Leave a channel
 * @param {string} channel - Channel name
 */
export const leave = (channel) => {
    const echo = getEcho();
    echo.leave(channel);
};

/**
 * Listen to notifications for authenticated user
 * @param {Function} callback - Notification callback
 * @returns {object} Channel instance
 */
export const notifications = (callback) => {
    const userId = JSON.parse(localStorage.getItem('auth_user') || '{}').id;

    if (!userId) {
        console.warn('Cannot listen to notifications: user not authenticated');
        return null;
    }

    const echo = getEcho();
    return echo
        .private(`App.Models.User.${userId}`)
        .notification(callback);
};

/**
 * Stop listening to a specific event on a channel
 * @param {string} channel - Channel name
 * @param {string} event - Event name
 */
export const stopListening = (channel, event) => {
    const echo = getEcho();
    echo.channel(channel).stopListening(event);
};

export default {
    getEcho,
    connect,
    disconnect,
    listen,
    listenPrivate,
    presence,
    leave,
    notifications,
    stopListening,
};
