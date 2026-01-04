<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed in specific order due to dependencies
        $this->call([
            ThemeSeeder::class,
            RolePermissionSeeder::class,
            GroupSeeder::class,
            CategorySeeder::class,
            AdminUserSeeder::class,
        ]);

        $this->command->info('All seeders completed successfully!');
    }
}
