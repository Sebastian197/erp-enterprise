<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DashboardLayout;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DashboardLayoutController extends Controller
{
    /**
     * Get the authenticated user's dashboard layout.
     */
    public function show(Request $request): JsonResponse
    {
        $layout = DashboardLayout::where('user_id', $request->user()->id)->first();

        if (!$layout) {
            // Return default layout if none exists
            return response()->json([
                'layout_config' => $this->getDefaultLayout(),
            ]);
        }

        return response()->json([
            'layout_config' => $layout->layout_config,
        ]);
    }

    /**
     * Save or update the authenticated user's dashboard layout.
     */
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'layout_config' => 'required|array',
        ]);

        $layout = DashboardLayout::updateOrCreate(
            ['user_id' => $request->user()->id],
            ['layout_config' => $request->layout_config]
        );

        return response()->json([
            'message' => 'Layout saved successfully',
            'layout_config' => $layout->layout_config,
        ]);
    }

    /**
     * Get default dashboard layout configuration.
     */
    private function getDefaultLayout(): array
    {
        return [
            ['i' => 'stats', 'x' => 0, 'y' => 0, 'w' => 12, 'h' => 4],
            ['i' => 'quick-actions', 'x' => 0, 'y' => 4, 'w' => 12, 'h' => 5],
            ['i' => 'recent-activity', 'x' => 0, 'y' => 9, 'w' => 12, 'h' => 8],
        ];
    }
}
