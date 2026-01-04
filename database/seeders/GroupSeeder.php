<?php

namespace Database\Seeders;

use App\Models\Group;
use Illuminate\Database\Seeder;

class GroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $groups = [
            [
                'name' => 'Development',
                'description' => 'Software development and engineering team',
                'is_active' => true,
            ],
            [
                'name' => 'Administration',
                'description' => 'Administrative and management staff',
                'is_active' => true,
            ],
            [
                'name' => 'Support',
                'description' => 'Customer support and technical assistance',
                'is_active' => true,
            ],
            [
                'name' => 'Sales',
                'description' => 'Sales and business development team',
                'is_active' => true,
            ],
        ];

        foreach ($groups as $group) {
            Group::create($group);
        }
    }
}