<?php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

/**
 * UserRepository
 *
 * Handles data access operations for User model.
 */
class UserRepository
{
    /**
     * Get all users with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = User::query()->with(['emails', 'phones', 'group', 'preference', 'categories', 'roles']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['group_id'])) {
            $query->where('group_id', $filters['group_id']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('username', 'like', "%{$filters['search']}%");
            });
        }

        return $query->get();
    }

    /**
     * Find user by ID.
     *
     * @param int $id
     * @return User|null
     */
    public function findById(int $id): ?User
    {
        return User::with(['emails', 'phones', 'group', 'preference', 'categories', 'roles', 'permissions'])
            ->find($id);
    }

    /**
     * Find user by username.
     *
     * @param string $username
     * @return User|null
     */
    public function findByUsername(string $username): ?User
    {
        return User::where('username', $username)
            ->with(['emails', 'phones', 'group', 'preference', 'categories', 'roles', 'permissions'])
            ->first();
    }

    /**
     * Find user by email (searches in user_emails table).
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return User::whereHas('emails', function ($q) use ($email) {
            $q->where('email', $email);
        })
        ->with(['emails', 'phones', 'group', 'preference.theme', 'categories', 'roles', 'permissions'])
        ->first();
    }

    /**
     * Create a new user.
     *
     * @param array $data
     * @return User
     */
    public function create(array $data): User
    {
        return User::create($data);
    }

    /**
     * Update user.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    /**
     * Delete user.
     *
     * @param User $user
     * @return bool
     */
    public function delete(User $user): bool
    {
        return $user->delete();
    }
}