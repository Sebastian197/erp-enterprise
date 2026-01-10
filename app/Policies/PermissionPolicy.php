<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Models\Permission;

/**
 * Permission Policy
 *
 * Handles authorization for Permission model operations.
 * Note: Super Admin and privileged groups (Administradores, Webmaster)
 * are automatically handled by Gate::before() in AuthServiceProvider.
 */
class PermissionPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any permissions.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('permissions.view');
    }

    /**
     * Determine whether the user can view the permission.
     */
    public function view(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.view');
    }

    /**
     * Determine whether the user can create permissions.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('permissions.create');
    }

    /**
     * Determine whether the user can update the permission.
     */
    public function update(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.update');
    }

    /**
     * Determine whether the user can delete the permission.
     */
    public function delete(User $user, Permission $permission): bool
    {
        return $user->hasPermissionTo('permissions.delete');
    }
}
