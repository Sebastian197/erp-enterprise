<?php

namespace App\Services;

use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\UserEmailRepository;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\UnauthorizedException;

/**
 * AuthService
 *
 * Handles authentication business logic.
 */
class AuthService
{
    public function __construct(
        protected UserRepository $userRepository,
        protected UserEmailRepository $userEmailRepository
    ) {}

    /**
     * Authenticate user by username and password.
     *
     * @param string $username
     * @param string $password
     * @return array
     * @throws UnauthorizedException
     */
    public function login(string $username, string $password): array
    {
        // Find user by username
        $user = $this->userRepository->findByUsername($username);

        if (!$user) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Verify password
        if (!Hash::check($password, $user->password)) {
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Check if user is active
        if ($user->status !== UserStatus::ACTIVE) {
            throw new UnauthorizedException('Account is not active.');
        }

        // Create token
        $token = $this->createToken($user);

        return [
            'user' => $user->load([
                'emails',
                'phones',
                'preference.theme',
                'group',
                'categories',
                'roles.permissions',
                'permissions'
            ]),
            'token' => $token,
        ];
    }

    /**
     * Create authentication token for user.
     *
     * @param User $user
     * @param string $tokenName
     * @return string
     */
    public function createToken(User $user, string $tokenName = 'auth-token'): string
    {
        return $user->createToken($tokenName)->plainTextToken;
    }

    /**
     * Revoke all user tokens.
     *
     * @param User $user
     * @return void
     */
    public function revokeTokens(User $user): void
    {
        $user->tokens()->delete();
    }

    /**
     * Update user profile.
     *
     * @param User $user
     * @param array $data
     * @return User
     */
    public function updateProfile(User $user, array $data): User
    {
        $allowedFields = ['name', 'username', 'avatar'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        return $this->userRepository->update($user, $updateData);
    }

    /**
     * Update user password.
     *
     * @param User $user
     * @param string $newPassword
     * @return bool
     */
    public function updatePassword(User $user, string $newPassword): bool
    {
        $user->password = Hash::make($newPassword);
        return $user->save();
    }
}