/**
 * Main application entry point
 * Bootstraps Vue 3 with all necessary plugins and configurations
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { MotionPlugin } from '@vueuse/motion';
import router from './router';
import i18n from './i18n';
import App from './App.vue';

// Import bootstrap for axios setup
import './bootstrap';

// Import global styles
import '../css/app.css';

/**
 * Create and configure Pinia store
 */
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

/**
 * Create Vue application instance
 */
const app = createApp(App);

/**
 * Register plugins
 */
app.use(pinia);           // State management
app.use(router);          // Routing
app.use(i18n);            // Internationalization
app.use(MotionPlugin);    // Animations

/**
 * Global error handler
 */
app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err);
    console.error('Component:', instance);
    console.error('Error info:', info);
};

/**
 * Global warning handler (development only)
 */
if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
        console.warn('Warning:', msg);
        console.warn('Trace:', trace);
    };
}

/**
 * Mount application
 */
app.mount('#app');

/**
 * Enable HMR (Hot Module Replacement) in development
 */
if (import.meta.hot) {
    import.meta.hot.accept();
}