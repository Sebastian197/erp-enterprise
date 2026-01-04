<?php

namespace App\Services;

use App\Repositories\UserEmailRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

/**
 * PasswordResetService
 *
 * Handles password reset business logic.
 */
class PasswordResetService
{
    public function __construct(
        protected UserEmailRepository $userEmailRepository
    ) {}

    /**
     * Send password reset link to user's email.
     *
     * @param string $email
     * @return bool
     */
    public function sendResetLink(string $email): bool
    {
        // Find email in user_emails table
        $userEmail = $this->userEmailRepository->findByEmail($email);

        if (!$userEmail) {
            return false;
        }

        $user = $userEmail->user;

        // Send password reset link
        $status = Password::sendResetLink(['email' => $email]);

        return $status === Password::RESET_LINK_SENT;
    }

    /**
     * Reset user password using token.
     *
     * @param string $email
     * @param string $token
     * @param string $password
     * @return bool
     */
    public function resetPassword(string $email, string $token, string $password): bool
    {
        // Find email in user_emails table
        $userEmail = $this->userEmailRepository->findByEmail($email);

        if (!$userEmail) {
            return false;
        }

        $user = $userEmail->user;

        // Reset password
        $status = Password::reset(
            [
                'email' => $email,
                'password' => $password,
                'password_confirmation' => $password,
                'token' => $token,
            ],
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        return $status === Password::PASSWORD_RESET;
    }
}