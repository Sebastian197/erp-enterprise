<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryCost;
use App\Models\Group;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get groups
        $developmentGroup = Group::where('name', 'Development')->first();
        $administrationGroup = Group::where('name', 'Administration')->first();
        $supportGroup = Group::where('name', 'Support')->first();
        $salesGroup = Group::where('name', 'Sales')->first();

        // Development Group Categories
        if ($developmentGroup) {
            $this->createCategoryWithCosts(
                $developmentGroup->id,
                'Senior Full Stack Developer',
                'Experienced full stack developer with 5+ years',
                60.00,
                48.00,
                90.00,
                72.00,
                120.00,
                96.00,
                480.00,
                384.00,
                8
            );

            $this->createCategoryWithCosts(
                $developmentGroup->id,
                'Junior Developer',
                'Entry-level developer with 1-2 years experience',
                30.00,
                24.00,
                45.00,
                36.00,
                60.00,
                48.00,
                240.00,
                192.00,
                8
            );

            $this->createCategoryWithCosts(
                $developmentGroup->id,
                'Tech Lead',
                'Technical leadership and architecture',
                80.00,
                64.00,
                120.00,
                96.00,
                160.00,
                128.00,
                640.00,
                512.00,
                8
            );

            $this->createCategoryWithCosts(
                $developmentGroup->id,
                'DevOps Engineer',
                'Infrastructure and deployment specialist',
                65.00,
                52.00,
                97.50,
                78.00,
                130.00,
                104.00,
                520.00,
                416.00,
                8
            );
        }

        // Administration Group Categories
        if ($administrationGroup) {
            $this->createCategoryWithCosts(
                $administrationGroup->id,
                'Manager',
                'Department manager and team leader',
                70.00,
                56.00,
                105.00,
                84.00,
                140.00,
                112.00,
                560.00,
                448.00,
                8
            );

            $this->createCategoryWithCosts(
                $administrationGroup->id,
                'Administrator',
                'System and business administrator',
                50.00,
                40.00,
                75.00,
                60.00,
                100.00,
                80.00,
                400.00,
                320.00,
                8
            );

            $this->createCategoryWithCosts(
                $administrationGroup->id,
                'HR Specialist',
                'Human resources specialist',
                45.00,
                36.00,
                67.50,
                54.00,
                90.00,
                72.00,
                360.00,
                288.00,
                8
            );
        }

        // Support Group Categories
        if ($supportGroup) {
            $this->createCategoryWithCosts(
                $supportGroup->id,
                'Technical Support',
                'Technical support specialist',
                35.00,
                28.00,
                52.50,
                42.00,
                70.00,
                56.00,
                280.00,
                224.00,
                8
            );

            $this->createCategoryWithCosts(
                $supportGroup->id,
                'Customer Service',
                'Customer service representative',
                25.00,
                20.00,
                37.50,
                30.00,
                50.00,
                40.00,
                200.00,
                160.00,
                8
            );

            $this->createCategoryWithCosts(
                $supportGroup->id,
                'Support Lead',
                'Support team leader',
                55.00,
                44.00,
                82.50,
                66.00,
                110.00,
                88.00,
                440.00,
                352.00,
                8
            );
        }

        // Sales Group Categories
        if ($salesGroup) {
            $this->createCategoryWithCosts(
                $salesGroup->id,
                'Account Manager',
                'Client account management',
                60.00,
                48.00,
                90.00,
                72.00,
                120.00,
                96.00,
                480.00,
                384.00,
                8
            );

            $this->createCategoryWithCosts(
                $salesGroup->id,
                'Sales Representative',
                'Sales and business development',
                40.00,
                32.00,
                60.00,
                48.00,
                80.00,
                64.00,
                320.00,
                256.00,
                8
            );

            $this->createCategoryWithCosts(
                $salesGroup->id,
                'Sales Director',
                'Sales strategy and leadership',
                90.00,
                72.00,
                135.00,
                108.00,
                180.00,
                144.00,
                720.00,
                576.00,
                8
            );
        }
    }

    /**
     * Create a category with its associated costs.
     */
    private function createCategoryWithCosts(
        int $groupId,
        string $name,
        string $description,
        float $hourlyRatePvp,
        float $hourlyRatePc,
        float $overtimeRatePvp,
        float $overtimeRatePc,
        float $holidayRatePvp,
        float $holidayRatePc,
        float $dailyRatePvp,
        float $dailyRatePc,
        int $dailyMinimumHours
    ): void {
        $category = Category::create([
            'group_id' => $groupId,
            'name' => $name,
            'description' => $description,
            'is_active' => true,
        ]);

        CategoryCost::create([
            'category_id' => $category->id,
            'hourly_rate_pvp' => $hourlyRatePvp,
            'hourly_rate_pc' => $hourlyRatePc,
            'overtime_rate_pvp' => $overtimeRatePvp,
            'overtime_rate_pc' => $overtimeRatePc,
            'holiday_rate_pvp' => $holidayRatePvp,
            'holiday_rate_pc' => $holidayRatePc,
            'daily_rate_pvp' => $dailyRatePvp,
            'daily_rate_pc' => $dailyRatePc,
            'daily_minimum_hours' => $dailyMinimumHours,
            'currency' => 'EUR',
            'valid_from' => now(),
            'valid_to' => null,
        ]);
    }
}