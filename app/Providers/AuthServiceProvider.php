<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Group;
use App\Models\Theme;
use App\Models\User;
use App\Models\UserPreference;
use App\Policies\CategoryPolicy;
use App\Policies\GroupPolicy;
use App\Policies\PermissionPolicy;
use App\Policies\PreferencePolicy;
use App\Policies\RolePolicy;
use App\Policies\ThemePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

/**
 * Authorization Service Provider
 *
 * Registers all authorization policies for the ERP system.
 */
class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Group::class => GroupPolicy::class,
        Category::class => CategoryPolicy::class,
        Theme::class => ThemePolicy::class,
        UserPreference::class => PreferencePolicy::class,
        Permission::class => PermissionPolicy::class,
        Role::class => RolePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Centralized authorization hook
        Gate::before(function (User $user, string $ability) {
            // 1. Super Admin bypass (existing behavior)
            if ($user->hasRole('Super Admin')) {
                return true;
            }

            // 2. Privileged groups system (NEW)
            // Users in "Administradores" or "Webmaster" groups have automatic full access
            // unless explicitly denied
            if ($user->isPrivilegedGroup()) {
                // Check if permission is explicitly denied (negative permission)
                if ($user->hasExplicitDenyPermission($ability)) {
                    return false; // Explicitly denied
                }

                return true; // Granted by privileged group
            }

            // 3. Fall through to policies and normal permission checks
            return null;
        });
    }
}