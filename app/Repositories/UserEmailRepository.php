<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\UserEmail;
use Illuminate\Database\Eloquent\Collection;

/**
 * UserEmailRepository
 *
 * Handles data access operations for UserEmail model.
 */
class UserEmailRepository
{
    /**
     * Get all user emails with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = UserEmail::query()->with('user');

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['is_primary'])) {
            $query->where('is_primary', $filters['is_primary']);
        }

        return $query->get();
    }

    /**
     * Find user email by ID.
     *
     * @param int $id
     * @return UserEmail|null
     */
    public function findById(int $id): ?UserEmail
    {
        return UserEmail::with('user')->find($id);
    }

    /**
     * Find user by email address.
     *
     * @param string $email
     * @return UserEmail|null
     */
    public function findByEmail(string $email): ?UserEmail
    {
        return UserEmail::where('email', $email)
            ->with('user.group', 'user.preference', 'user.categories', 'user.roles', 'user.permissions')
            ->first();
    }

    /**
     * Create a new user email.
     *
     * @param array $data
     * @return UserEmail
     */
    public function create(array $data): UserEmail
    {
        return UserEmail::create($data);
    }

    /**
     * Update user email.
     *
     * @param UserEmail $userEmail
     * @param array $data
     * @return UserEmail
     */
    public function update(UserEmail $userEmail, array $data): UserEmail
    {
        $userEmail->update($data);
        return $userEmail->fresh();
    }

    /**
     * Delete user email.
     *
     * @param UserEmail $userEmail
     * @return bool
     */
    public function delete(UserEmail $userEmail): bool
    {
        return $userEmail->delete();
    }

    /**
     * Ensure only one primary email per user.
     * If setting an email as primary, unset other primary emails.
     *
     * @param User $user
     * @return void
     */
    public function ensureOnePrimary(User $user): void
    {
        // Check if user has at least one primary email
        $primaryCount = UserEmail::where('user_id', $user->id)
            ->where('is_primary', true)
            ->count();

        // If no primary email exists, set the first email as primary
        if ($primaryCount === 0) {
            $firstEmail = UserEmail::where('user_id', $user->id)->first();
            if ($firstEmail) {
                $firstEmail->update(['is_primary' => true]);
            }
        }
    }
}
