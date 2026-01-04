<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserEmail;
use App\Models\UserPhone;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * UserController
 *
 * Handles user management operations (Admin only).
 * This is where administrators create new users - there is NO public registration.
 */
class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Display a listing of users.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['status', 'group_id', 'search']);
            $users = $this->userService->getAll($filters);

            return response()->json([
                'data' => $users,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve users',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created user (Admin creates users).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users,username',
                'email' => 'required|email|unique:user_emails,email',
                'password' => 'required|string|min:8',
                'avatar' => 'nullable|string',
                'status' => 'nullable|string|in:active,inactive,suspended',
                'group_id' => 'nullable|exists:groups,id',
                'locale' => 'nullable|string',
                'timezone' => 'nullable|string',
                'theme_id' => 'nullable|exists:themes,id',
                'roles' => 'nullable|array',
                'roles.*' => 'string|exists:roles,name',
            ]);

            $user = $this->userService->create($validated);

            return response()->json([
                'message' => 'User created successfully',
                'data' => $user,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified user.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        try {
            $user->load([
                'emails',
                'phones',
                'preference.theme',
                'group',
                'categories',
                'roles.permissions',
                'permissions'
            ]);

            return response()->json([
                'data' => $user,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified user.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'username' => 'sometimes|string|max:255|unique:users,username,' . $user->id,
                'password' => 'sometimes|string|min:8',
                'avatar' => 'sometimes|nullable|string',
                'status' => 'sometimes|string|in:active,inactive,suspended',
                'group_id' => 'sometimes|nullable|exists:groups,id',
            ]);

            $updatedUser = $this->userService->update($user, $validated);

            return response()->json([
                'message' => 'User updated successfully',
                'data' => $updatedUser,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified user.
     *
     * @param User $user
     * @return JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        try {
            $this->userService->delete($user);

            return response()->json([
                'message' => 'User deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete user',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add email to user.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function addEmail(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email|unique:user_emails,email',
                'type' => 'nullable|string|in:personal,work',
                'is_primary' => 'nullable|boolean',
            ]);

            $email = $this->userService->addEmail($user, $validated);

            return response()->json([
                'message' => 'Email added successfully',
                'data' => $email,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add email',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add phone to user.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function addPhone(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'phone' => 'required|string|max:20',
                'type' => 'nullable|string|in:mobile,home,work',
                'is_primary' => 'nullable|boolean',
            ]);

            $phone = $this->userService->addPhone($user, $validated);

            return response()->json([
                'message' => 'Phone added successfully',
                'data' => $phone,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to add phone',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove email from user.
     *
     * @param UserEmail $email
     * @return JsonResponse
     */
    public function removeEmail(UserEmail $email): JsonResponse
    {
        try {
            $this->userService->removeEmail($email);

            return response()->json([
                'message' => 'Email removed successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove email',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove phone from user.
     *
     * @param UserPhone $phone
     * @return JsonResponse
     */
    public function removePhone(UserPhone $phone): JsonResponse
    {
        try {
            $this->userService->removePhone($phone);

            return response()->json([
                'message' => 'Phone removed successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to remove phone',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign multiple categories to user with is_primary support.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function assignCategories(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'categories' => 'required|array',
                'categories.*.category_id' => 'required|integer|exists:categories,id',
                'categories.*.is_primary' => 'required|boolean',
            ]);

            // Transform to format expected by service
            $categories = [];
            foreach ($validated['categories'] as $cat) {
                $categories[$cat['category_id']] = ['is_primary' => $cat['is_primary']];
            }

            $this->userService->assignCategories($user, $categories);

            return response()->json([
                'message' => 'Categories assigned successfully',
                'data' => $user->fresh()->load('categories'),
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to assign categories',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Set a category as primary for user.
     *
     * @param Request $request
     * @param User $user
     * @param int $categoryId
     * @return JsonResponse
     */
    public function setPrimaryCategory(Request $request, User $user, int $categoryId): JsonResponse
    {
        try {
            $this->userService->setPrimaryCategory($user, $categoryId);

            return response()->json([
                'message' => 'Primary category set successfully',
                'data' => $user->fresh()->load('categories'),
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to set primary category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign roles to user.
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function assignRoles(Request $request, User $user): JsonResponse
    {
        try {
            $validated = $request->validate([
                'roles' => 'required|array',
                'roles.*' => 'string|exists:roles,name',
            ]);

            $this->userService->assignRoles($user, $validated['roles']);

            return response()->json([
                'message' => 'Roles assigned successfully',
                'data' => $user->fresh()->load('roles.permissions'),
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to assign roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
