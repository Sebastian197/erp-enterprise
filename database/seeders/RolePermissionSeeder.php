<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define all permissions
        $permissions = [
            // User permissions
            'users.view',
            'users.create',
            'users.update',
            'users.delete',

            // Group permissions
            'groups.view',
            'groups.create',
            'groups.update',
            'groups.delete',

            // Category permissions
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',

            // Theme permissions
            'themes.view',
            'themes.create',
            'themes.update',
            'themes.delete',

            // Preference permissions
            'preferences.view',
            'preferences.update',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create Super Admin role with all permissions
        $superAdmin = Role::create(['name' => 'Super Admin']);
        $superAdmin->givePermissionTo(Permission::all());

        // Create Admin role
        $admin = Role::create(['name' => 'Admin']);
        $admin->givePermissionTo([
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'groups.view',
            'groups.create',
            'groups.update',
            'groups.delete',
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',
            'themes.view',
            'preferences.view',
            'preferences.update',
        ]);

        // Create Manager role
        $manager = Role::create(['name' => 'Manager']);
        $manager->givePermissionTo([
            'users.view',
            'users.create',
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',
            'groups.view',
            'themes.view',
            'preferences.view',
            'preferences.update',
        ]);

        // Create User role
        $user = Role::create(['name' => 'User']);
        $user->givePermissionTo([
            'users.view',
            'themes.view',
            'preferences.view',
            'preferences.update',
        ]);
    }
}