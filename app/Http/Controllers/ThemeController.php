<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use App\Services\ThemeService;
use Illuminate\Http\JsonResponse;

/**
 * ThemeController
 *
 * Handles theme operations.
 */
class ThemeController extends Controller
{
    public function __construct(
        protected ThemeService $themeService
    ) {}

    /**
     * Display a listing of active themes.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $themes = $this->themeService->getAll();

            return response()->json([
                'data' => $themes,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve themes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified theme.
     *
     * @param Theme $theme
     * @return JsonResponse
     */
    public function show(Theme $theme): JsonResponse
    {
        try {
            return response()->json([
                'data' => $theme,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve theme',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
