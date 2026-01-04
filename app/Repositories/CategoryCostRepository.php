<?php

namespace App\Repositories;

use App\Models\CategoryCost;
use Illuminate\Database\Eloquent\Collection;

/**
 * CategoryCostRepository
 *
 * Handles data access operations for CategoryCost model.
 */
class CategoryCostRepository
{
    /**
     * Get all category costs with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = CategoryCost::query()->with('category');

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        return $query->get();
    }

    /**
     * Find category cost by ID.
     *
     * @param int $id
     * @return CategoryCost|null
     */
    public function findById(int $id): ?CategoryCost
    {
        return CategoryCost::with('category')->find($id);
    }

    /**
     * Find category cost by category ID.
     *
     * @param int $categoryId
     * @return CategoryCost|null
     */
    public function findByCategory(int $categoryId): ?CategoryCost
    {
        return CategoryCost::where('category_id', $categoryId)
            ->with('category')
            ->first();
    }

    /**
     * Create a new category cost.
     *
     * @param array $data
     * @return CategoryCost
     */
    public function create(array $data): CategoryCost
    {
        return CategoryCost::create($data);
    }

    /**
     * Update category cost.
     *
     * @param CategoryCost $categoryCost
     * @param array $data
     * @return CategoryCost
     */
    public function update(CategoryCost $categoryCost, array $data): CategoryCost
    {
        $categoryCost->update($data);
        return $categoryCost->fresh();
    }

    /**
     * Delete category cost.
     *
     * @param CategoryCost $categoryCost
     * @return bool
     */
    public function delete(CategoryCost $categoryCost): bool
    {
        return $categoryCost->delete();
    }
}