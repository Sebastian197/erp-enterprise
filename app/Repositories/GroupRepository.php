<?php

namespace App\Repositories;

use App\Models\Group;
use Illuminate\Database\Eloquent\Collection;

/**
 * GroupRepository
 *
 * Handles data access operations for Group model.
 */
class GroupRepository
{
    /**
     * Get all groups with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Group::query()->with(['users', 'categories']);

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        return $query->get();
    }

    /**
     * Find group by ID.
     *
     * @param int $id
     * @return Group|null
     */
    public function findById(int $id): ?Group
    {
        return Group::with(['users', 'categories'])->find($id);
    }

    /**
     * Create a new group.
     *
     * @param array $data
     * @return Group
     */
    public function create(array $data): Group
    {
        return Group::create($data);
    }

    /**
     * Update group.
     *
     * @param Group $group
     * @param array $data
     * @return Group
     */
    public function update(Group $group, array $data): Group
    {
        $group->update($data);
        return $group->fresh();
    }

    /**
     * Delete group.
     *
     * @param Group $group
     * @return bool
     */
    public function delete(Group $group): bool
    {
        return $group->delete();
    }
}