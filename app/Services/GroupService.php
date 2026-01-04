<?php

namespace App\Services;

use App\Models\Group;
use App\Repositories\GroupRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * GroupService
 *
 * Handles group management business logic.
 */
class GroupService
{
    public function __construct(
        protected GroupRepository $groupRepository
    ) {}

    /**
     * Get all groups with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        return $this->groupRepository->getAll($filters);
    }

    /**
     * Get group by ID.
     *
     * @param int $id
     * @return Group|null
     */
    public function getById(int $id): ?Group
    {
        return $this->groupRepository->findById($id);
    }

    /**
     * Create a new group.
     *
     * @param array $data
     * @return Group
     */
    public function create(array $data): Group
    {
        return $this->groupRepository->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);
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
        $allowedFields = ['name', 'description', 'is_active'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        return $this->groupRepository->update($group, $updateData);
    }

    /**
     * Delete group.
     *
     * @param Group $group
     * @return bool
     * @throws \Exception
     */
    public function delete(Group $group): bool
    {
        // Check if group has users
        if ($group->users()->count() > 0) {
            throw new \Exception('Cannot delete group with assigned users.');
        }

        // Check if group has categories
        if ($group->categories()->count() > 0) {
            throw new \Exception('Cannot delete group with assigned categories.');
        }

        return $this->groupRepository->delete($group);
    }
}