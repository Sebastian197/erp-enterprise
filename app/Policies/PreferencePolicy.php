<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Preference Policy
 *
 * Handles authorization for UserPreference model operations.
 * Users can only manage their own preferences.
 */
class PreferencePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view the preference.
     *
     * Users can only view their own preferences.
     */
    public function view(User $user, UserPreference $preference): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // Users can only view their own preferences
        return $user->id === $preference->user_id;
    }

    /**
     * Determine whether the user can update the preference.
     *
     * Users can only update their own preferences.
     */
    public function update(User $user, UserPreference $preference): bool
    {
        // Super Admin has all permissions
        if ($user->hasRole('Super Admin')) {
            return true;
        }

        // Users can only update their own preferences
        return $user->id === $preference->user_id;
    }
}