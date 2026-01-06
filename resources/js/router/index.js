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

// HRM
const HRMEmployees = () => import('@/pages/hrm/employees/Index.vue');
const HRMDepartments = () => import('@/pages/hrm/departments/Index.vue');
const HRMPayroll = () => import('@/pages/hrm/payroll/Index.vue');
const HRMAttendance = () => import('@/pages/hrm/attendance/Index.vue');
const HRMMastersGroups = () => import('@/pages/hrm/masters/groups/Index.vue');
const HRMMastersCategories = () => import('@/pages/hrm/masters/categories/Index.vue');

// WebMaster
const WebMasterPermissions = () => import('@/pages/webmaster/permissions/Index.vue');
const WebMasterGrantPermissions = () => import('@/pages/webmaster/grant-permissions/Index.vue');

// Settings
const Settings = () => import('@/pages/settings/Index.vue');

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
                    icon: 'fa-home',
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
                    title: 'profile.title',
                    requiresAuth: true,
                    icon: 'fa-user',
                },
            },

            // HRM routes
            {
                path: 'hrm',
                name: 'hrm',
                redirect: { name: 'hrm.employees' },
                meta: {
                    title: 'hrm.title',
                    requiresAuth: true,
                    icon: 'fa-user-tie',
                },
                children: [
                    {
                        path: 'employees',
                        name: 'hrm.employees',
                        component: HRMEmployees,
                        meta: {
                            title: 'hrm.employees',
                            requiresAuth: true,
                        },
                    },
                    {
                        path: 'departments',
                        name: 'hrm.departments',
                        component: HRMDepartments,
                        meta: {
                            title: 'hrm.departments',
                            requiresAuth: true,
                        },
                    },
                    {
                        path: 'payroll',
                        name: 'hrm.payroll',
                        component: HRMPayroll,
                        meta: {
                            title: 'hrm.payroll',
                            requiresAuth: true,
                        },
                    },
                    {
                        path: 'attendance',
                        name: 'hrm.attendance',
                        component: HRMAttendance,
                        meta: {
                            title: 'hrm.attendance',
                            requiresAuth: true,
                        },
                    },
                    {
                        path: 'masters/groups',
                        name: 'hrm.masters.groups',
                        component: HRMMastersGroups,
                        meta: {
                            title: 'hrm.masters_groups',
                            requiresAuth: true,
                        },
                    },
                    {
                        path: 'masters/categories',
                        name: 'hrm.masters.categories',
                        component: HRMMastersCategories,
                        meta: {
                            title: 'hrm.masters_categories',
                            requiresAuth: true,
                        },
                    },
                ],
            },

            // WebMaster routes
            {
                path: 'webmaster',
                name: 'webmaster',
                redirect: { name: 'webmaster.permissions' },
                meta: {
                    title: 'webmaster.title',
                    requiresAuth: true,
                    icon: 'fa-code',
                },
                children: [
                    {
                        path: 'permissions',
                        name: 'webmaster.permissions',
                        component: WebMasterPermissions,
                        meta: {
                            title: 'webmaster.permissions',
                            requiresAuth: true,
                        },
                    },
                    {
                        path: 'grant-permissions',
                        name: 'webmaster.grant-permissions',
                        component: WebMasterGrantPermissions,
                        meta: {
                            title: 'webmaster.grant_permissions',
                            requiresAuth: true,
                        },
                    },
                ],
            },

            // Settings route
            {
                path: 'settings',
                name: 'settings',
                component: Settings,
                meta: {
                    title: 'menu.settings',
                    requiresAuth: true,
                    icon: 'fa-cog',
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
