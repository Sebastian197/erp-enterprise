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

// Employees (anteriormente Users)
const EmployeesIndex = () => import('@/pages/users/Index.vue');
const EmployeesCreate = () => import('@/pages/users/Create.vue');
const EmployeesEdit = () => import('@/pages/users/Edit.vue');
const EmployeesShow = () => import('@/pages/users/Show.vue');

// Profile
const Profile = () => import('@/pages/profile/Index.vue');

// HRM
const HRMDepartments = () => import('@/pages/hrm/departments/Index.vue');
const HRMPayroll = () => import('@/pages/hrm/payroll/Index.vue');
const HRMAttendance = () => import('@/pages/hrm/attendance/Index.vue');

// HRM Masters - Groups
const GroupsIndex = () => import('@/pages/hrm/masters/groups/Index.vue');
const GroupsCreate = () => import('@/pages/hrm/masters/groups/Create.vue');
const GroupsEdit = () => import('@/pages/hrm/masters/groups/Edit.vue');
const GroupsShow = () => import('@/pages/hrm/masters/groups/Show.vue');

// HRM Masters - Categories
const CategoriesIndex = () => import('@/pages/hrm/masters/categories/Index.vue');
const CategoriesCreate = () => import('@/pages/hrm/masters/categories/Create.vue');
const CategoriesEdit = () => import('@/pages/hrm/masters/categories/Edit.vue');
const CategoriesShow = () => import('@/pages/hrm/masters/categories/Show.vue');

// WebMaster
const WebMasterPermissions = () => import('@/pages/webmaster/permissions/Index.vue');
const WebMasterGrantPermissions = () => import('@/pages/webmaster/grant-permissions/Index.vue');

// WebMaster - Roles
const RolesIndex = () => import('@/pages/webmaster/roles/Index.vue');
const RolesCreate = () => import('@/pages/webmaster/roles/Create.vue');
const RolesEdit = () => import('@/pages/webmaster/roles/Edit.vue');
const RolesShow = () => import('@/pages/webmaster/roles/Show.vue');

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
                    // Employees routes (CRUD completo)
                    {
                        path: 'employees',
                        name: 'hrm.employees',
                        redirect: { name: 'hrm.employees.index' },
                        meta: {
                            title: 'hrm.employees',
                            requiresAuth: true,
                            permissions: ['users.view'],
                        },
                        children: [
                            {
                                path: '',
                                name: 'hrm.employees.index',
                                component: EmployeesIndex,
                                meta: {
                                    title: 'hrm.employees',
                                    requiresAuth: true,
                                    permissions: ['users.view'],
                                },
                            },
                            {
                                path: 'create',
                                name: 'hrm.employees.create',
                                component: EmployeesCreate,
                                meta: {
                                    title: 'hrm.employees_create',
                                    requiresAuth: true,
                                    permissions: ['users.create'],
                                },
                            },
                            {
                                path: ':id',
                                name: 'hrm.employees.show',
                                component: EmployeesShow,
                                meta: {
                                    title: 'hrm.employees_show',
                                    requiresAuth: true,
                                    permissions: ['users.view'],
                                },
                                props: true,
                            },
                            {
                                path: ':id/edit',
                                name: 'hrm.employees.edit',
                                component: EmployeesEdit,
                                meta: {
                                    title: 'hrm.employees_edit',
                                    requiresAuth: true,
                                    permissions: ['users.update'],
                                },
                                props: true,
                            },
                        ],
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
                        path: 'masters',
                        name: 'hrm.masters',
                        redirect: { name: 'hrm.masters.groups.index' },
                        meta: {
                            title: 'hrm.masters',
                            requiresAuth: true,
                        },
                        children: [
                            // Groups routes
                            {
                                path: 'groups',
                                name: 'hrm.masters.groups',
                                redirect: { name: 'hrm.masters.groups.index' },
                                meta: {
                                    title: 'groups.title',
                                    requiresAuth: true,
                                    permissions: ['groups.view'],
                                },
                                children: [
                                    {
                                        path: '',
                                        name: 'hrm.masters.groups.index',
                                        component: GroupsIndex,
                                        meta: {
                                            title: 'groups.title',
                                            requiresAuth: true,
                                            permissions: ['groups.view'],
                                        },
                                    },
                                    {
                                        path: 'create',
                                        name: 'hrm.masters.groups.create',
                                        component: GroupsCreate,
                                        meta: {
                                            title: 'groups.create.title',
                                            requiresAuth: true,
                                            permissions: ['groups.create'],
                                        },
                                    },
                                    {
                                        path: ':id',
                                        name: 'hrm.masters.groups.show',
                                        component: GroupsShow,
                                        meta: {
                                            title: 'groups.show.title',
                                            requiresAuth: true,
                                            permissions: ['groups.view'],
                                        },
                                        props: true,
                                    },
                                    {
                                        path: ':id/edit',
                                        name: 'hrm.masters.groups.edit',
                                        component: GroupsEdit,
                                        meta: {
                                            title: 'groups.edit.title',
                                            requiresAuth: true,
                                            permissions: ['groups.update'],
                                        },
                                        props: true,
                                    },
                                ],
                            },
                            // Categories routes
                            {
                                path: 'categories',
                                name: 'hrm.masters.categories',
                                redirect: { name: 'hrm.masters.categories.index' },
                                meta: {
                                    title: 'categories.title',
                                    requiresAuth: true,
                                    permissions: ['categories.view'],
                                },
                                children: [
                                    {
                                        path: '',
                                        name: 'hrm.masters.categories.index',
                                        component: CategoriesIndex,
                                        meta: {
                                            title: 'categories.title',
                                            requiresAuth: true,
                                            permissions: ['categories.view'],
                                        },
                                    },
                                    {
                                        path: 'create',
                                        name: 'hrm.masters.categories.create',
                                        component: CategoriesCreate,
                                        meta: {
                                            title: 'categories.create.title',
                                            requiresAuth: true,
                                            permissions: ['categories.create'],
                                        },
                                    },
                                    {
                                        path: ':id',
                                        name: 'hrm.masters.categories.show',
                                        component: CategoriesShow,
                                        meta: {
                                            title: 'categories.show.title',
                                            requiresAuth: true,
                                            permissions: ['categories.view'],
                                        },
                                        props: true,
                                    },
                                    {
                                        path: ':id/edit',
                                        name: 'hrm.masters.categories.edit',
                                        component: CategoriesEdit,
                                        meta: {
                                            title: 'categories.edit.title',
                                            requiresAuth: true,
                                            permissions: ['categories.update'],
                                        },
                                        props: true,
                                    },
                                ],
                            },
                        ],
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
                            permissions: ['permissions.view'],
                        },
                    },
                    // Roles routes
                    {
                        path: 'roles',
                        name: 'webmaster.roles',
                        redirect: { name: 'webmaster.roles.index' },
                        meta: {
                            title: 'roles.title',
                            requiresAuth: true,
                            permissions: ['roles.view'],
                        },
                        children: [
                            {
                                path: '',
                                name: 'webmaster.roles.index',
                                component: RolesIndex,
                                meta: {
                                    title: 'roles.title',
                                    requiresAuth: true,
                                    permissions: ['roles.view'],
                                },
                            },
                            {
                                path: 'create',
                                name: 'webmaster.roles.create',
                                component: RolesCreate,
                                meta: {
                                    title: 'roles.create',
                                    requiresAuth: true,
                                    permissions: ['roles.create'],
                                },
                            },
                            {
                                path: ':id',
                                name: 'webmaster.roles.show',
                                component: RolesShow,
                                meta: {
                                    title: 'roles.show.title',
                                    requiresAuth: true,
                                    permissions: ['roles.view'],
                                },
                                props: true,
                            },
                            {
                                path: ':id/edit',
                                name: 'webmaster.roles.edit',
                                component: RolesEdit,
                                meta: {
                                    title: 'roles.edit',
                                    requiresAuth: true,
                                    permissions: ['roles.update'],
                                },
                                props: true,
                            },
                        ],
                    },
                    {
                        path: 'grant-permissions',
                        name: 'webmaster.grant-permissions',
                        component: WebMasterGrantPermissions,
                        meta: {
                            title: 'webmaster.grant_permissions',
                            requiresAuth: true,
                            permissions: ['users.grantPermissions'],
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
