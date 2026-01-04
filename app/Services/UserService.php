<?php

namespace App\Services;

use App\Enums\EmailType;
use App\Enums\UserStatus;
use App\Events\UserCreatedEvent;
use App\Events\UserStatusChangedEvent;
use App\Models\User;
use App\Models\UserEmail;
use App\Models\UserPhone;
use App\Notifications\WelcomeNotification;
use App\Repositories\UserEmailRepository;
use App\Repositories\UserPhoneRepository;
use App\Repositories\UserPreferenceRepository;
use App\Repositories\UserRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * UserService
 *
 * Handles user management business logic.
 */
class UserService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected UserEmailRepository $userEmailRepository,
        protected UserPhoneRepository $userPhoneRepository,
        protected UserPreferenceRepository $userPreferenceRepository
    ) {}

    /**
     * Get all users with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        return $this->userRepository->getAll($filters);
    }

    /**
     * Create a new user.
     * This method is only used by administrators to create users.
     *
     * @param array $data
     * @return User
     * @throws \Exception
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            // Create user with hashed password
            $user = $this->userRepository->create([
                'name' => $data['name'],
                'username' => $data['username'],
                'password' => Hash::make($data['password']),
                'avatar' => $data['avatar'] ?? null,
                'status' => $data['status'] ?? UserStatus::Active,
                'group_id' => $data['group_id'] ?? null,
            ]);

            // Create initial email (primary)
            if (isset($data['email'])) {
                $this->userEmailRepository->create([
                    'user_id' => $user->id,
                    'email' => $data['email'],
                    'type' => EmailType::Personal,
                    'is_primary' => true,
                ]);
            }

            // Create user preferences with defaults
            $this->userPreferenceRepository->create([
                'user_id' => $user->id,
                'locale' => $data['locale'] ?? 'en',
                'timezone' => $data['timezone'] ?? 'UTC',
                'theme_id' => $data['theme_id'] ?? null,
            ]);

            // Assign default role or provided role
            $roles = $data['roles'] ?? ['user'];
            $user->syncRoles($roles);

            // Assign primary category if provided
            if (isset($data['category_id'])) {
                $user->categories()->attach($data['category_id'], [
                    'is_primary' => true,
                    'assigned_at' => now(),
                    'assigned_by' => auth()->id(),
                ]);
            }

            $user = $user->fresh()->load([
                'emails',
                'phones',
                'preference',
                'group',
                'categories',
                'roles',
                'permissions'
            ]);

            // Dispatch user created event for real-time broadcasting
            event(new UserCreatedEvent($user));

            // Send welcome notification to the new user
            $user->notify(new WelcomeNotification($user));

            return $user;
        });
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
        $allowedFields = ['name', 'username', 'avatar', 'status', 'group_id'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        if (isset($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        // Track old status for event broadcasting
        $oldStatus = null;
        if (isset($updateData['status']) && $user->status !== $updateData['status']) {
            $oldStatus = $user->status instanceof UserStatus ? $user->status->value : $user->status;
        }

        $updatedUser = $this->userRepository->update($user, $updateData);

        // Dispatch status changed event if status was updated
        if ($oldStatus !== null) {
            $newStatus = $updatedUser->status instanceof UserStatus ? $updatedUser->status->value : $updatedUser->status;
            event(new UserStatusChangedEvent($updatedUser, $oldStatus, $newStatus));
        }

        return $updatedUser;
    }

    /**
     * Delete user.
     *
     * @param User $user
     * @return bool
     */
    public function delete(User $user): bool
    {
        return DB::transaction(function () use ($user) {
            // Delete related data
            $user->emails()->delete();
            $user->phones()->delete();
            $user->preference()->delete();
            $user->categories()->detach();
            $user->tokens()->delete();

            return $this->userRepository->delete($user);
        });
    }

    /**
     * Add email to user.
     *
     * @param User $user
     * @param array $data
     * @return UserEmail
     */
    public function addEmail(User $user, array $data): UserEmail
    {
        $email = $this->userEmailRepository->create([
            'user_id' => $user->id,
            'email' => $data['email'],
            'type' => $data['type'] ?? EmailType::Personal,
            'is_primary' => $data['is_primary'] ?? false,
        ]);

        // Ensure only one primary email
        if ($email->is_primary) {
            $this->userEmailRepository->ensureOnePrimary($user);
        }

        return $email;
    }

    /**
     * Add phone to user.
     *
     * @param User $user
     * @param array $data
     * @return UserPhone
     */
    public function addPhone(User $user, array $data): UserPhone
    {
        $phone = $this->userPhoneRepository->create([
            'user_id' => $user->id,
            'phone' => $data['phone'],
            'type' => $data['type'] ?? null,
            'is_primary' => $data['is_primary'] ?? false,
        ]);

        // Ensure only one primary phone
        if ($phone->is_primary) {
            $this->userPhoneRepository->ensureOnePrimary($user);
        }

        return $phone;
    }

    /**
     * Remove email from user.
     *
     * @param UserEmail $email
     * @return bool
     * @throws \Exception
     */
    public function removeEmail(UserEmail $email): bool
    {
        $user = $email->user;

        // Check if this is the last email
        $emailCount = $user->emails()->count();
        if ($emailCount <= 1) {
            throw new \Exception('Cannot remove the last email address.');
        }

        // Check if this is the primary email
        $wasPrimary = $email->is_primary;

        $result = $this->userEmailRepository->delete($email);

        // If deleted email was primary, set another email as primary
        if ($result && $wasPrimary) {
            $this->userEmailRepository->ensureOnePrimary($user);
        }

        return $result;
    }

    /**
     * Remove phone from user.
     *
     * @param UserPhone $phone
     * @return bool
     */
    public function removePhone(UserPhone $phone): bool
    {
        $user = $phone->user;
        $wasPrimary = $phone->is_primary;

        $result = $this->userPhoneRepository->delete($phone);

        // If deleted phone was primary, set another phone as primary
        if ($result && $wasPrimary) {
            $this->userPhoneRepository->ensureOnePrimary($user);
        }

        return $result;
    }

    /**
     * Assign multiple categories to user with pivot data.
     *
     * @param User $user
     * @param array $categories Array with category_id as key and ['is_primary' => bool] as value
     * @return void
     */
    public function assignCategories(User $user, array $categories): void
    {
        $syncData = [];

        foreach ($categories as $categoryId => $pivotData) {
            $syncData[$categoryId] = [
                'is_primary' => $pivotData['is_primary'] ?? false,
                'assigned_at' => now(),
                'assigned_by' => auth()->id(),
            ];
        }

        $user->categories()->sync($syncData);
    }

    /**
     * Set a category as primary for user.
     *
     * @param User $user
     * @param int $categoryId
     * @return void
     */
    public function setPrimaryCategory(User $user, int $categoryId): void
    {
        DB::transaction(function () use ($user, $categoryId) {
            // First, ensure the category is attached to the user
            if (!$user->categories()->where('category_id', $categoryId)->exists()) {
                $user->categories()->attach($categoryId, [
                    'is_primary' => true,
                    'assigned_at' => now(),
                    'assigned_by' => auth()->id(),
                ]);
            } else {
                // Update all categories to not primary
                $user->categories()->updateExistingPivot(
                    $user->categories()->pluck('categories.id')->toArray(),
                    ['is_primary' => false]
                );

                // Set the specified category as primary
                $user->categories()->updateExistingPivot($categoryId, ['is_primary' => true]);
            }
        });
    }

    /**
     * Assign roles to user.
     *
     * @param User $user
     * @param array $roleNames
     * @return void
     */
    public function assignRoles(User $user, array $roleNames): void
    {
        $user->syncRoles($roleNames);
    }
}