<?php

namespace App\Http\Controllers;

use App\Services\PreferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * PreferenceController
 *
 * Handles user preference operations.
 */
class PreferenceController extends Controller
{
    public function __construct(
        protected PreferenceService $preferenceService
    ) {}

    /**
     * Get current user's preferences.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        try {
            $preference = $this->preferenceService->getUserPreference($request->user());

            return response()->json([
                'data' => $preference->load('theme'),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update current user's preferences.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'sometimes|string|max:10',
                'timezone' => 'sometimes|string|max:50',
                'theme_id' => 'sometimes|nullable|exists:themes,id',
            ]);

            $preference = $this->preferenceService->updatePreference($request->user(), $validated);

            return response()->json([
                'message' => 'Preferences updated successfully',
                'data' => $preference->load('theme'),
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update preferences',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update current user's locale.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateLocale(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'locale' => 'required|string|max:10',
            ]);

            $preference = $this->preferenceService->updateLocale($request->user(), $validated['locale']);

            return response()->json([
                'message' => 'Locale updated successfully',
                'data' => $preference,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update locale',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update current user's theme.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateTheme(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'theme_id' => 'required|exists:themes,id',
            ]);

            $preference = $this->preferenceService->updateTheme($request->user(), $validated['theme_id']);

            return response()->json([
                'message' => 'Theme updated successfully',
                'data' => $preference->load('theme'),
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update theme',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
