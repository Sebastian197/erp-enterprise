/**
 * Bootstrap file
 * Sets up axios and Laravel Echo for the application
 */

import axios from 'axios';

// Set up axios defaults
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Get CSRF token from meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]');
if (csrfToken) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

/**
 * Laravel Echo setup
 * Echo is configured separately in utils/echo.js and used via composables
 * This allows for better control over WebSocket connections
 */