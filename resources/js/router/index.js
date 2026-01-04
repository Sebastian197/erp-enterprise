/**
 * Vue Router Configuration
 * Defines all application routes and navigation
 */

import { createRouter, createWebHistory } from 'vue-router';
import { beforeEachGuard, afterEachGuard, errorHandler } from './guards';

// Layouts
const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const DashboardLayout = () => import('@/layouts/DashboardLayout.vue');

// Auth Pages
const Login = () => import('@/pages/auth/Login.vue');
const ForgotPassword = () => import('@/pages/auth/ForgotPassword.vue');
const ResetPassword = () => import('@/pages/auth/ResetPassword.vue');

// Dashboard
const Dashboard = () => import('@/pages/dashboard/Index.vue');

// Users
const UsersIndex = () => import('@/pages/users/Index.vue');
const UsersCreate = () => import('@/pages/users/Create.vue');
const UsersEdit = () => import('@/pages/users/Edit.vue');
const UsersShow = () => import('@/pages/users/Show.vue');

// Profile
const Profile = () => import('@/pages/profile/Index.vue');

// Error Pages
const Forbidden = () => import('@/pages/errors/403.vue');
const NotFound = () => import('@/pages/errors/404.vue');
const ServerError = () => import('@/pages/errors/500.vue');

/**
 * Route definitions
 */
const routes = [
    // Auth routes
    {
        path: '/auth',
        component: AuthLayout,
        meta: { guest: true },
        children: [
            {
                path: 'login',
                name: 'login',
                component: Login,
                meta: {
                    title: 'Login',
                    guest: true,
                },
            },
            {
                path: 'forgot-password',
                name: 'forgot-password',
                component: ForgotPassword,
                meta: {
                    title: 'Forgot Password',
                    guest: true,
                },
            },
            {
                path: 'reset-password/:token',
                name: 'reset-password',
                component: ResetPassword,
                meta: {
                    title: 'Reset Password',
                    guest: true,
                },
                props: true,
            },
        ],
    },

    // Main application routes
    {
        path: '/',
        component: DashboardLayout,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                redirect: { name: 'dashboard' },
            },
            {
                path: 'dashboard',
                name: 'dashboard',
                component: Dashboard,
                meta: {
                    title: 'Dashboard',
                    requiresAuth: true,
                    icon: 'fa-tachometer-alt',
                },
            },

            // Users routes
            {
                path: 'users',
                name: 'users',
                redirect: { name: 'users.index' },
                meta: {
                    title: 'Users',
                    requiresAuth: true,
                    permissions: ['users.view'],
                    icon: 'fa-users',
                },
                children: [
                    {
                        path: '',
                        name: 'users.index',
                        component: UsersIndex,
                        meta: {
                            title: 'Users List',
                            requiresAuth: true,
                            permissions: ['users.view'],
                        },
                    },
                    {
                        path: 'create',
                        name: 'users.create',
                        component: UsersCreate,
                        meta: {
                            title: 'Create User',
                            requiresAuth: true,
                            permissions: ['users.create'],
                        },
                    },
                    {
                        path: ':id',
                        name: 'users.show',
                        component: UsersShow,
                        meta: {
                            title: 'View User',
                            requiresAuth: true,
                            permissions: ['users.view'],
                        },
                        props: true,
                    },
                    {
                        path: ':id/edit',
                        name: 'users.edit',
                        component: UsersEdit,
                        meta: {
                            title: 'Edit User',
                            requiresAuth: true,
                            permissions: ['users.update'],
                        },
                        props: true,
                    },
                ],
            },

            // Profile route
            {
                path: 'profile',
                name: 'profile',
                component: Profile,
                meta: {
                    title: 'My Profile',
                    requiresAuth: true,
                    icon: 'fa-user',
                },
            },
        ],
    },

    // Error routes
    {
        path: '/403',
        name: 'forbidden',
        component: Forbidden,
        meta: {
            title: '403 - Forbidden',
        },
    },
    {
        path: '/500',
        name: 'server-error',
        component: ServerError,
        meta: {
            title: '500 - Server Error',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
        meta: {
            title: '404 - Not Found',
        },
    },
];

/**
 * Create router instance
 */
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        }
        return { top: 0 };
    },
});

/**
 * Register navigation guards
 */
router.beforeEach(beforeEachGuard);
router.afterEach(afterEachGuard);
router.onError(errorHandler);

export default router;
