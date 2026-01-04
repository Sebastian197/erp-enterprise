<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserPhone;
use Illuminate\Database\Eloquent\Collection;

/**
 * UserPhoneRepository
 *
 * Handles data access operations for UserPhone model.
 */
class UserPhoneRepository
{
    /**
     * Get all user phones with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = UserPhone::query()->with('user');

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['is_primary'])) {
            $query->where('is_primary', $filters['is_primary']);
        }

        return $query->get();
    }

    /**
     * Find user phone by ID.
     *
     * @param int $id
     * @return UserPhone|null
     */
    public function findById(int $id): ?UserPhone
    {
        return UserPhone::with('user')->find($id);
    }

    /**
     * Create a new user phone.
     *
     * @param array $data
     * @return UserPhone
     */
    public function create(array $data): UserPhone
    {
        return UserPhone::create($data);
    }

    /**
     * Update user phone.
     *
     * @param UserPhone $userPhone
     * @param array $data
     * @return UserPhone
     */
    public function update(UserPhone $userPhone, array $data): UserPhone
    {
        $userPhone->update($data);
        return $userPhone->fresh();
    }

    /**
     * Delete user phone.
     *
     * @param UserPhone $userPhone
     * @return bool
     */
    public function delete(UserPhone $userPhone): bool
    {
        return $userPhone->delete();
    }

    /**
     * Ensure only one primary phone per user.
     * If setting a phone as primary, unset other primary phones.
     *
     * @param User $user
     * @return void
     */
    public function ensureOnePrimary(User $user): void
    {
        // Check if user has at least one primary phone
        $primaryCount = UserPhone::where('user_id', $user->id)
            ->where('is_primary', true)
            ->count();

        // If no primary phone exists, set the first phone as primary
        if ($primaryCount === 0) {
            $firstPhone = UserPhone::where('user_id', $user->id)->first();
            if ($firstPhone) {
                $firstPhone->update(['is_primary' => true]);
            }
        }

        // If multiple primary phones exist, keep only the first one
        if ($primaryCount > 1) {
            $primaryPhones = UserPhone::where('user_id', $user->id)
                ->where('is_primary', true)
                ->get();

            foreach ($primaryPhones->skip(1) as $phone) {
                $phone->update(['is_primary' => false]);
            }
        }
    }
}