<?php

namespace App\Http\Controllers;

use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Permission;

/**
 * PermissionController
 *
 * Handles permission management operations.
 */
class PermissionController extends Controller
{
    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Display a listing of permissions.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['search', 'group']);
            $permissions = $this->permissionService->getAll($filters);

            return response()->json([
                'data' => $permissions,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created permission.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:permissions,name',
                'guard_name' => 'nullable|string|max:255',
            ]);

            $permission = $this->permissionService->create($validated);

            return response()->json([
                'message' => 'Permission created successfully',
                'data' => $permission,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified permission.
     *
     * @param Permission $permission
     * @return JsonResponse
     */
    public function show(Permission $permission): JsonResponse
    {
        try {
            return response()->json([
                'data' => $permission,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified permission.
     *
     * @param Request $request
     * @param Permission $permission
     * @return JsonResponse
     */
    public function update(Request $request, Permission $permission): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:permissions,name,' . $permission->id,
                'guard_name' => 'nullable|string|max:255',
            ]);

            $permission = $this->permissionService->update($permission, $validated);

            return response()->json([
                'message' => 'Permission updated successfully',
                'data' => $permission,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified permission.
     *
     * @param Permission $permission
     * @return JsonResponse
     */
    public function destroy(Permission $permission): JsonResponse
    {
        try {
            $this->permissionService->delete($permission);

            return response()->json([
                'message' => 'Permission deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete permission',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
