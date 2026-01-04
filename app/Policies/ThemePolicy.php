<?php

namespace App\Policies;

use App\Models\Theme;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Theme Policy
 *
 * Handles authorization for Theme model operations using Spatie Permission.
 */
class ThemePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any themes.
     *
     * All authenticated users can view themes.
     */
    public function viewAny(User $user): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // All users can view themes
        return $user->hasPermissionTo('themes.view');
    }

    /**
     * Determine whether the user can view the theme.
     *
     * All authenticated users can view individual themes.
     */
    public function view(User $user, Theme $theme): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // All users can view themes
        return $user->hasPermissionTo('themes.view');
    }

    /**
     * Determine whether the user can create themes.
     *
     * Only admins can create themes.
     */
    public function create(User $user): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return $user->hasPermissionTo('themes.create');
    }

    /**
     * Determine whether the user can update the theme.
     *
     * Only admins can update themes.
     */
    public function update(User $user, Theme $theme): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return $user->hasPermissionTo('themes.update');
    }

    /**
     * Determine whether the user can delete the theme.
     *
     * Only admins can delete themes.
     */
    public function delete(User $user, Theme $theme): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        return $user->hasPermissionTo('themes.delete');
    }
}