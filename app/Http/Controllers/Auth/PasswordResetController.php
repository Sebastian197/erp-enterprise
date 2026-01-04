<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\PasswordResetService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * PasswordResetController
 *
 * Handles password reset operations.
 */
class PasswordResetController extends Controller
{
    public function __construct(
        protected PasswordResetService $passwordResetService
    ) {}

    /**
     * Send password reset link to user's email.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function sendResetLink(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
            ]);

            $sent = $this->passwordResetService->sendResetLink($validated['email']);

            if (!$sent) {
                return response()->json([
                    'message' => 'Unable to send password reset link',
                ], 400);
            }

            return response()->json([
                'message' => 'Password reset link sent to your email',
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send reset link',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reset user password using token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function reset(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'token' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $reset = $this->passwordResetService->resetPassword(
                $validated['email'],
                $validated['token'],
                $validated['password']
            );

            if (!$reset) {
                return response()->json([
                    'message' => 'Password reset failed. Invalid token or email.',
                ], 400);
            }

            return response()->json([
                'message' => 'Password has been reset successfully',
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Password reset failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}