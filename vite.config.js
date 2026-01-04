import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
            '@components': fileURLToPath(new URL('./resources/js/components', import.meta.url)),
            '@pages': fileURLToPath(new URL('./resources/js/pages', import.meta.url)),
            '@layouts': fileURLToPath(new URL('./resources/js/layouts', import.meta.url)),
            '@stores': fileURLToPath(new URL('./resources/js/stores', import.meta.url)),
            '@composables': fileURLToPath(new URL('./resources/js/composables', import.meta.url)),
            '@utils': fileURLToPath(new URL('./resources/js/utils', import.meta.url)),
            '@i18n': fileURLToPath(new URL('./resources/js/i18n', import.meta.url)),
            '@styles': fileURLToPath(new URL('./resources/js/styles', import.meta.url)),
        },
    },
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
        hmr: {
            host: 'localhost',
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['vue', 'vue-router', 'pinia'],
                    'ui': ['@vueuse/motion', 'animejs'],
                    'charts': ['chart.js'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    optimizeDeps: {
        include: ['vue', 'vue-router', 'pinia', 'vue-i18n', 'axios'],
    },
});
