<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Database\Eloquent\Collection;

/**
 * UserPreferenceRepository
 *
 * Handles data access operations for UserPreference model.
 */
class UserPreferenceRepository
{
    /**
     * Get all user preferences with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = UserPreference::query()->with(['user', 'theme']);

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['locale'])) {
            $query->where('locale', $filters['locale']);
        }

        return $query->get();
    }

    /**
     * Find user preference by ID.
     *
     * @param int $id
     * @return UserPreference|null
     */
    public function findById(int $id): ?UserPreference
    {
        return UserPreference::with(['user', 'theme'])->find($id);
    }

    /**
     * Find user preference by user.
     *
     * @param User $user
     * @return UserPreference|null
     */
    public function findByUser(User $user): ?UserPreference
    {
        return UserPreference::where('user_id', $user->id)
            ->with('theme')
            ->first();
    }

    /**
     * Create a new user preference.
     *
     * @param array $data
     * @return UserPreference
     */
    public function create(array $data): UserPreference
    {
        return UserPreference::create($data);
    }

    /**
     * Update user preference.
     *
     * @param UserPreference $userPreference
     * @param array $data
     * @return UserPreference
     */
    public function update(UserPreference $userPreference, array $data): UserPreference
    {
        $userPreference->update($data);
        return $userPreference->fresh();
    }

    /**
     * Delete user preference.
     *
     * @param UserPreference $userPreference
     * @return bool
     */
    public function delete(UserPreference $userPreference): bool
    {
        return $userPreference->delete();
    }

    /**
     * Create default user preference.
     *
     * @param User $user
     * @param int|null $themeId
     * @return UserPreference
     */
    public function createDefault(User $user, ?int $themeId = null): UserPreference
    {
        return $this->create([
            'user_id' => $user->id,
            'locale' => 'en',
            'theme_id' => $themeId,
            'timezone' => 'UTC',
        ]);
    }
}