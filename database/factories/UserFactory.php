<?php

namespace Database\Factories;

use App\Enums\EmailType;
use App\Enums\UserStatus;
use App\Models\Group;
use App\Models\Theme;
use App\Models\UserEmail;
use App\Models\UserPreference;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();
        $username = strtolower(str_replace(' ', '.', $name)) . rand(1, 999);

        return [
            'name' => $name,
            'username' => $username,
            'password' => static::$password ??= Hash::make('password'),
            'avatar' => null,
            'status' => UserStatus::ACTIVE,
            'group_id' => Group::inRandomOrder()->first()?->id,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Configure the model factory with relationships.
     */
    public function configure(): static
    {
        return $this->afterCreating(function ($user) {
            // Create primary email
            UserEmail::create([
                'user_id' => $user->id,
                'email' => fake()->unique()->safeEmail(),
                'type' => EmailType::PRIMARY,
                'is_primary' => true,
                'verified_at' => now(),
            ]);

            // Create user preferences
            UserPreference::create([
                'user_id' => $user->id,
                'locale' => 'en',
                'theme_id' => Theme::where('is_default', true)->first()?->id,
                'timezone' => 'UTC',
            ]);
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->afterCreating(function ($user) {
            // Update the primary email to be unverified
            $user->emails()->where('is_primary', true)->update([
                'verified_at' => null,
            ]);
        });
    }
}
