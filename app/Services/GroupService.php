<?php

namespace App\Services;

use App\Events\GroupCreatedEvent;
use App\Events\GroupDeletedEvent;
use App\Events\GroupUpdatedEvent;
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
        $group = $this->groupRepository->create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        // Reload with relationships for broadcasting
        $group = $group->fresh()->load(['users', 'categories']);

        // Dispatch broadcast event
        event(new GroupCreatedEvent($group));

        return $group;
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

        $updatedGroup = $this->groupRepository->update($group, $updateData);

        // Reload with relationships for broadcasting
        $updatedGroup = $updatedGroup->fresh()->load(['users', 'categories']);

        // Dispatch broadcast event
        event(new GroupUpdatedEvent($updatedGroup));

        return $updatedGroup;
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

        // Capture data before deletion
        $groupData = [
            'id' => $group->id,
            'name' => $group->name,
        ];

        $result = $this->groupRepository->delete($group);

        if ($result) {
            // Dispatch broadcast event
            event(new GroupDeletedEvent($groupData));
        }

        return $result;
    }
}