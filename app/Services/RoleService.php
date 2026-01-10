<?php

namespace App\Services;

use App\Events\RoleCreatedEvent;
use App\Events\RoleDeletedEvent;
use App\Events\RolePermissionsUpdatedEvent;
use App\Events\RoleUpdatedEvent;
use App\Repositories\RoleRepository;
use Illuminate\Database\Eloquent\Collection;
use Spatie\Permission\Models\Role;

/**
 * RoleService
 *
 * Handles role management business logic.
 */
class RoleService
{
    public function __construct(
        protected RoleRepository $roleRepository
    ) {}

    /**
     * Get all roles with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        if (!empty($filters['search'])) {
            return $this->roleRepository->getPaginated($filters, 1000)->getCollection();
        }

        return $this->roleRepository->getWithPermissions();
    }

    /**
     * Get paginated roles.
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], int $perPage = 15)
    {
        return $this->roleRepository->getPaginated($filters, $perPage);
    }

    /**
     * Get role by ID.
     *
     * @param int $id
     * @return Role|null
     */
    public function getById(int $id): ?Role
    {
        return $this->roleRepository->findWithPermissions($id);
    }

    /**
     * Create a new role.
     *
     * @param array $data
     * @return Role
     */
    public function create(array $data): Role
    {
        $role = $this->roleRepository->create([
            'name' => $data['name'],
            'guard_name' => $data['guard_name'] ?? 'web',
        ]);

        // Reload with permissions for broadcasting
        $role = $role->fresh()->load('permissions');

        // Dispatch broadcast event
        event(new RoleCreatedEvent($role));

        return $role;
    }

    /**
     * Update role.
     *
     * @param Role $role
     * @param array $data
     * @return Role
     */
    public function update(Role $role, array $data): Role
    {
        $allowedFields = ['name', 'guard_name'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        $this->roleRepository->update($role, $updateData);

        // Reload with permissions
        $role = $role->fresh()->load('permissions');

        // Dispatch broadcast event
        event(new RoleUpdatedEvent($role));

        return $role;
    }

    /**
     * Delete role.
     *
     * @param Role $role
     * @return bool
     */
    public function delete(Role $role): bool
    {
        $roleData = [
            'id' => $role->id,
            'name' => $role->name,
        ];

        $deleted = $this->roleRepository->delete($role);

        if ($deleted) {
            // Dispatch broadcast event with deleted role data
            event(new RoleDeletedEvent($roleData));
        }

        return $deleted;
    }

    /**
     * Assign permissions to role.
     *
     * @param Role $role
     * @param array $permissionIds
     * @return Role
     */
    public function assignPermissionsToRole(Role $role, array $permissionIds): Role
    {
        $this->roleRepository->attachPermissions($role, $permissionIds);

        // Reload with permissions
        $role = $role->fresh()->load('permissions');

        // Dispatch broadcast event
        event(new RolePermissionsUpdatedEvent($role));

        return $role;
    }

    /**
     * Revoke permissions from role.
     *
     * @param Role $role
     * @param array $permissionIds
     * @return Role
     */
    public function revokePermissionsFromRole(Role $role, array $permissionIds): Role
    {
        $this->roleRepository->detachPermissions($role, $permissionIds);

        // Reload with permissions
        $role = $role->fresh()->load('permissions');

        // Dispatch broadcast event
        event(new RolePermissionsUpdatedEvent($role));

        return $role;
    }

    /**
     * Sync permissions to role (replaces all existing permissions).
     *
     * @param Role $role
     * @param array $permissionIds
     * @return Role
     */
    public function syncPermissionsToRole(Role $role, array $permissionIds): Role
    {
        $this->roleRepository->syncPermissions($role, $permissionIds);

        // Reload with permissions
        $role = $role->fresh()->load('permissions');

        // Dispatch broadcast event
        event(new RolePermissionsUpdatedEvent($role));

        return $role;
    }

    /**
     * Get role by name.
     *
     * @param string $name
     * @return Role|null
     */
    public function findByName(string $name): ?Role
    {
        return $this->roleRepository->getByName($name);
    }

    /**
     * Get users count for a role.
     *
     * @param Role $role
     * @return int
     */
    public function getUsersCount(Role $role): int
    {
        return $this->roleRepository->getUsersCount($role);
    }
}
