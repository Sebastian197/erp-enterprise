<?php

namespace App\Services;

use App\Events\CategoryCreatedEvent;
use App\Events\CategoryDeletedEvent;
use App\Events\CategoryUpdatedEvent;
use App\Models\Category;
use App\Models\CategoryCost;
use App\Repositories\CategoryCostRepository;
use App\Repositories\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

/**
 * CategoryService
 *
 * Handles category management business logic.
 */
class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository,
        protected CategoryCostRepository $categoryCostRepository
    ) {}

    /**
     * Get all categories with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        return $this->categoryRepository->getAll($filters);
    }

    /**
     * Get category by ID.
     *
     * @param int $id
     * @return Category|null
     */
    public function getById(int $id): ?Category
    {
        return $this->categoryRepository->findById($id);
    }

    /**
     * Create a new category.
     *
     * @param array $data
     * @return Category
     */
    public function create(array $data): Category
    {
        $category = $this->categoryRepository->create([
            'group_id' => $data['group_id'],
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        // Reload with relationships for broadcasting
        $category = $category->fresh()->load(['group', 'users']);

        // Dispatch broadcast event
        event(new CategoryCreatedEvent($category));

        return $category;
    }

    /**
     * Update category.
     *
     * @param Category $category
     * @param array $data
     * @return Category
     */
    public function update(Category $category, array $data): Category
    {
        $allowedFields = ['group_id', 'name', 'description', 'is_active'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        $updatedCategory = $this->categoryRepository->update($category, $updateData);

        // Reload with relationships for broadcasting
        $updatedCategory = $updatedCategory->fresh()->load(['group', 'users']);

        // Dispatch broadcast event
        event(new CategoryUpdatedEvent($updatedCategory));

        return $updatedCategory;
    }

    /**
     * Delete category.
     *
     * @param Category $category
     * @return bool
     * @throws \Exception
     */
    public function delete(Category $category): bool
    {
        // Capture data before deletion
        $categoryData = [
            'id' => $category->id,
            'name' => $category->name,
            'group_id' => $category->group_id,
        ];

        $result = DB::transaction(function () use ($category) {
            // Check if category has assigned users
            if ($category->users()->count() > 0) {
                throw new \Exception('Cannot delete category with assigned users.');
            }

            // Delete category costs
            if ($category->categoryCost) {
                $this->categoryCostRepository->delete($category->categoryCost);
            }

            return $this->categoryRepository->delete($category);
        });

        if ($result) {
            // Dispatch broadcast event after successful deletion
            event(new CategoryDeletedEvent($categoryData));
        }

        return $result;
    }

    /**
     * Update category costs.
     *
     * @param Category $category
     * @param array $data
     * @return CategoryCost
     */
    public function updateCosts(Category $category, array $data): CategoryCost
    {
        $existingCost = $this->categoryCostRepository->findByCategory($category->id);

        if ($existingCost) {
            return $this->categoryCostRepository->update($existingCost, $data);
        }

        return $this->categoryCostRepository->create([
            'category_id' => $category->id,
            ...$data
        ]);
    }
}