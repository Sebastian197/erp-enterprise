/**
 * Menu Configuration
 * Defines the sidebar navigation menu structure
 * Used by Sidebar component and breadcrumb generation
 */

export const menuItems = [
  {
    name: 'Dashboard',
    i18nKey: 'menu.dashboard',
    icon: 'fas fa-home',
    route: '/dashboard',
    permission: null,
  },
  {
    name: 'HRM',
    i18nKey: 'menu.hrm',
    icon: 'fas fa-user-tie',
    route: '/hrm',
    permission: null,
    children: [
      {
        name: 'Employees',
        i18nKey: 'hrm.employees',
        icon: 'fas fa-user-friends',
        route: '/hrm/employees',
        permission: null,
      },
      {
        name: 'Departments',
        i18nKey: 'hrm.departments',
        icon: 'fas fa-sitemap',
        route: '/hrm/departments',
        permission: null,
      },
      {
        name: 'Payroll',
        i18nKey: 'hrm.payroll',
        icon: 'fas fa-money-bill-wave',
        route: '/hrm/payroll',
        permission: null,
      },
      {
        name: 'Attendance',
        i18nKey: 'hrm.attendance',
        icon: 'fas fa-calendar-check',
        route: '/hrm/attendance',
        permission: null,
      },
      {
        name: 'Masters',
        i18nKey: 'hrm.masters',
        icon: 'fas fa-database',
        route: '/hrm/masters',
        permission: null,
        children: [
          {
            name: 'Groups',
            i18nKey: 'hrm.masters_groups',
            icon: 'fas fa-layer-group',
            route: '/hrm/masters/groups',
            permission: null,
          },
          {
            name: 'Categories',
            i18nKey: 'hrm.masters_categories',
            icon: 'fas fa-tags',
            route: '/hrm/masters/categories',
            permission: null,
          },
        ],
      },
    ],
  },
  {
    name: 'WebMaster',
    i18nKey: 'menu.webmaster',
    icon: 'fas fa-code',
    route: '/webmaster',
    permission: null,
    children: [
      {
        name: 'Permissions',
        i18nKey: 'webmaster.permissions',
        icon: 'fas fa-shield-alt',
        route: '/webmaster/permissions',
        permission: 'permissions.view',
      },
      {
        name: 'Roles',
        i18nKey: 'roles.title',
        icon: 'fas fa-user-tag',
        route: '/webmaster/roles',
        permission: 'roles.view',
      },
      {
        name: 'Grant Permissions',
        i18nKey: 'webmaster.grant_permissions',
        icon: 'fas fa-user-shield',
        route: '/webmaster/grant-permissions',
        permission: 'users.grantPermissions',
      },
    ],
  },
  {
    name: 'Settings',
    i18nKey: 'menu.settings',
    icon: 'fas fa-cog',
    route: '/settings',
    permission: null,
  },
];

/**
 * Find menu item path by route
 * Returns array of menu items from root to target
 * @param {string} targetRoute - The route to find
 * @param {Array} items - Menu items to search (defaults to menuItems)
 * @param {Array} path - Current path being built (used internally)
 * @returns {Array|null} Array of menu items forming the path, or null if not found
 */
export function findMenuPath(targetRoute, items = menuItems, path = []) {
  for (const item of items) {
    const currentPath = [...path, item];

    // Exact match
    if (item.route === targetRoute) {
      return currentPath;
    }

    // Check if target route starts with this item's route (for child routes)
    if (targetRoute.startsWith(item.route + '/')) {
      if (item.children) {
        const childPath = findMenuPath(targetRoute, item.children, currentPath);
        if (childPath) return childPath;
      }
      // If no children matched but route starts with this path, return current path
      return currentPath;
    }

    // Search in children
    if (item.children) {
      const childPath = findMenuPath(targetRoute, item.children, currentPath);
      if (childPath) return childPath;
    }
  }

  return null;
}

/**
 * Generate breadcrumbs from menu path
 * @param {Array} menuPath - Array of menu items from findMenuPath
 * @param {Function} t - i18n translate function
 * @returns {Array} Breadcrumb items with label and to properties
 */
export function generateBreadcrumbs(menuPath, t) {
  if (!menuPath || menuPath.length === 0) {
    return [];
  }

  return menuPath.map((item, index) => {
    const isLast = index === menuPath.length - 1;
    return {
      label: t(item.i18nKey) || item.name,
      to: isLast ? null : item.route,
    };
  });
}
