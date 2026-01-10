<?php

namespace App\Services;

use App\Events\PermissionCreatedEvent;
use App\Events\PermissionDeletedEvent;
use App\Events\PermissionUpdatedEvent;
use App\Repositories\PermissionRepository;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Permission;

/**
 * PermissionService
 *
 * Handles permission management business logic.
 */
class PermissionService
{
    public function __construct(
        protected PermissionRepository $permissionRepository
    ) {}

    /**
     * Get all permissions with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        if (!empty($filters['search']) || !empty($filters['group'])) {
            return $this->permissionRepository->getPaginated($filters, 1000)->getCollection();
        }

        return $this->permissionRepository->getAll();
    }

    /**
     * Get paginated permissions.
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], int $perPage = 15)
    {
        return $this->permissionRepository->getPaginated($filters, $perPage);
    }

    /**
     * Get permission by ID.
     *
     * @param int $id
     * @return Permission|null
     */
    public function getById(int $id): ?Permission
    {
        return $this->permissionRepository->findById($id);
    }

    /**
     * Get permissions by group/module.
     *
     * @param string $group
     * @return Collection
     */
    public function getByGroup(string $group): Collection
    {
        return $this->permissionRepository->getByGroup($group);
    }

    /**
     * Create a new permission.
     *
     * @param array $data
     * @return Permission
     */
    public function create(array $data): Permission
    {
        $permission = $this->permissionRepository->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Dispatch broadcast event
        event(new PermissionCreatedEvent($permission));

        return $permission;
    }

    /**
     * Update permission.
     *
     * @param Permission $permission
     * @param array $data
     * @return Permission
     */
    public function update(Permission $permission, array $data): Permission
    {
        $allowedFields = ['name', 'guard_name'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        $this->permissionRepository->update($permission, $updateData);

        // Reload model
        $permission = $permission->fresh();

        // Dispatch broadcast event
        event(new PermissionUpdatedEvent($permission));

        return $permission;
    }

    /**
     * Delete permission.
     *
     * @param Permission $permission
     * @return bool
     */
    public function delete(Permission $permission): bool
    {
        $permissionData = [
            'id' => $permission->id,
            'name' => $permission->name,
        ];

        $deleted = $this->permissionRepository->delete($permission);

        if ($deleted) {
            // Dispatch broadcast event with deleted permission data
            event(new PermissionDeletedEvent($permissionData));
        }

        return $deleted;
    }

    /**
     * Search permissions by name.
     *
     * @param string $search
     * @return Collection
     */
    public function search(string $search): Collection
    {
        return $this->permissionRepository->searchByName($search);
    }

    /**
     * Find permission by name.
     *
     * @param string $name
     * @return Permission|null
     */
    public function findByName(string $name): ?Permission
    {
        return $this->permissionRepository->findByName($name);
    }
}
