<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Role;

/**
 * Role Policy
 *
 * Handles authorization for Role model operations.
 * Note: Super Admin and privileged groups (Administradores, Webmaster)
 * are automatically handled by Gate::before() in AuthServiceProvider.
 */
class RolePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any roles.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('roles.view');
    }

    /**
     * Determine whether the user can view the role.
     */
    public function view(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.view');
    }

    /**
     * Determine whether the user can create roles.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('roles.create');
    }

    /**
     * Determine whether the user can update the role.
     */
    public function update(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.update');
    }

    /**
     * Determine whether the user can delete the role.
     */
    public function delete(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.delete');
    }

    /**
     * Determine whether the user can assign permissions to roles.
     */
    public function assignPermissions(User $user, Role $role): bool
    {
        return $user->hasPermissionTo('roles.assignPermissions');
    }
}
