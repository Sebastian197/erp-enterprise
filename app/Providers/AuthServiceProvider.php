<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Group;
use App\Models\Theme;
use App\Models\User;
use App\Models\UserPreference;
use App\Policies\CategoryPolicy;
use App\Policies\GroupPolicy;
use App\Policies\PreferencePolicy;
use App\Policies\ThemePolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

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
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}