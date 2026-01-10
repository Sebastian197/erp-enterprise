<?php

namespace App\Http\Controllers;

use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;

/**
 * RoleController
 *
 * Handles role management operations.
 */
class RoleController extends Controller
{
    public function __construct(
        protected RoleService $roleService
    ) {}

    /**
     * Display a listing of roles.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['search']);
            $roles = $this->roleService->getAll($filters);

            return response()->json([
                'data' => $roles,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created role.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:roles,name',
                'guard_name' => 'nullable|string|max:255',
            ]);

            $role = $this->roleService->create($validated);

            return response()->json([
                'message' => 'Role created successfully',
                'data' => $role,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified role.
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function show(Role $role): JsonResponse
    {
        try {
            $role->load('permissions');

            return response()->json([
                'data' => $role,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified role.
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255|unique:roles,name,' . $role->id,
                'guard_name' => 'nullable|string|max:255',
            ]);

            $role = $this->roleService->update($role, $validated);

            return response()->json([
                'message' => 'Role updated successfully',
                'data' => $role,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified role.
     *
     * @param Role $role
     * @return JsonResponse
     */
    public function destroy(Role $role): JsonResponse
    {
        try {
            $this->roleService->delete($role);

            return response()->json([
                'message' => 'Role deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete role',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Attach permissions to role.
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function attachPermissions(Request $request, Role $role): JsonResponse
    {
        try {
            $this->authorize('update', $role);

            $validated = $request->validate([
                'permission_ids' => 'required|array',
                'permission_ids.*' => 'required|integer|exists:permissions,id',
            ]);

            $role = $this->roleService->assignPermissionsToRole($role, $validated['permission_ids']);

            return response()->json([
                'message' => 'Permissions assigned successfully',
                'data' => $role,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to assign permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Detach permissions from role.
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function detachPermissions(Request $request, Role $role): JsonResponse
    {
        try {
            $this->authorize('update', $role);

            $validated = $request->validate([
                'permission_ids' => 'required|array',
                'permission_ids.*' => 'required|integer|exists:permissions,id',
            ]);

            $role = $this->roleService->revokePermissionsFromRole($role, $validated['permission_ids']);

            return response()->json([
                'message' => 'Permissions revoked successfully',
                'data' => $role,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to revoke permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Sync permissions to role (replaces all existing).
     *
     * @param Request $request
     * @param Role $role
     * @return JsonResponse
     */
    public function syncPermissions(Request $request, Role $role): JsonResponse
    {
        try {
            $this->authorize('update', $role);

            $validated = $request->validate([
                'permission_ids' => 'required|array',
                'permission_ids.*' => 'required|integer|exists:permissions,id',
            ]);

            $role = $this->roleService->syncPermissionsToRole($role, $validated['permission_ids']);

            return response()->json([
                'message' => 'Permissions synchronized successfully',
                'data' => $role,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to synchronize permissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
