<?php

namespace Database\Seeders;

use App\Enums\EmailType;
use App\Enums\PhoneType;
use App\Enums\UserStatus;
use App\Models\Category;
use App\Models\Group;
use App\Models\Theme;
use App\Models\User;
use App\Models\UserEmail;
use App\Models\UserPhone;
use App\Models\UserPreference;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Administration group
        $administrationGroup = Group::where('name', 'Administration')->first();

        // Get Administrator category
        $administratorCategory = Category::where('name', 'Administrator')
            ->where('group_id', $administrationGroup->id)
            ->first();

        // Get default theme
        $defaultTheme = Theme::where('is_default', true)->first();

        // Create admin user
        $admin = User::create([
            'username' => 'admin',
            'name' => 'System Administrator',
            'password' => Hash::make('admin123'),
            'avatar' => null,
            'status' => UserStatus::ACTIVE,
            'group_id' => $administrationGroup->id,
        ]);

        // Create primary email
        UserEmail::create([
            'user_id' => $admin->id,
            'email' => 'admin@erp.com',
            'type' => EmailType::PRIMARY,
            'is_primary' => true,
            'verified_at' => now(),
        ]);

        // Create phone
        UserPhone::create([
            'user_id' => $admin->id,
            'phone' => '+34 900 000 000',
            'type' => PhoneType::TRABAJO,
            'is_primary' => true,
        ]);

        // Create user preferences
        UserPreference::create([
            'user_id' => $admin->id,
            'locale' => 'en',
            'theme_id' => $defaultTheme?->id,
            'timezone' => 'UTC',
        ]);

        // Assign Super Admin role
        $admin->assignRole('Super Admin');

        // Assign primary category
        if ($administratorCategory) {
            $admin->categories()->attach($administratorCategory->id, [
                'is_primary' => true,
                'assigned_at' => now(),
                'assigned_by' => $admin->id, // Self-assigned
            ]);
        }

        $this->command->info('Admin user created successfully!');
        $this->command->info('Username: admin');
        $this->command->info('Email: admin@erp.com');
        $this->command->info('Password: admin123');
    }
}
