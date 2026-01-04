<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

/**
 * CategoryController
 *
 * Handles category management operations.
 */
class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    /**
     * Display a listing of categories.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $filters = $request->only(['is_active', 'group_id', 'search']);
            $categories = $this->categoryService->getAll($filters);

            return response()->json([
                'data' => $categories,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve categories',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created category.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'group_id' => 'required|exists:groups,id',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'is_active' => 'nullable|boolean',
            ]);

            $category = $this->categoryService->create($validated);

            return response()->json([
                'message' => 'Category created successfully',
                'data' => $category,
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified category.
     *
     * @param Category $category
     * @return JsonResponse
     */
    public function show(Category $category): JsonResponse
    {
        try {
            $category->load(['group', 'users', 'categoryCost']);

            return response()->json([
                'data' => $category,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to retrieve category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified category.
     *
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        try {
            $validated = $request->validate([
                'group_id' => 'sometimes|exists:groups,id',
                'name' => 'sometimes|string|max:255',
                'description' => 'sometimes|nullable|string',
                'is_active' => 'sometimes|boolean',
            ]);

            $updatedCategory = $this->categoryService->update($category, $validated);

            return response()->json([
                'message' => 'Category updated successfully',
                'data' => $updatedCategory,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update category',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified category.
     *
     * @param Category $category
     * @return JsonResponse
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            $this->categoryService->delete($category);

            return response()->json([
                'message' => 'Category deleted successfully',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete category',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update category costs.
     *
     * @param Request $request
     * @param Category $category
     * @return JsonResponse
     */
    public function updateCosts(Request $request, Category $category): JsonResponse
    {
        try {
            $validated = $request->validate([
                'hourly_cost' => 'nullable|numeric|min:0',
                'monthly_cost' => 'nullable|numeric|min:0',
                'annual_cost' => 'nullable|numeric|min:0',
            ]);

            $categoryCost = $this->categoryService->updateCosts($category, $validated);

            return response()->json([
                'message' => 'Category costs updated successfully',
                'data' => $categoryCost,
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update category costs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
