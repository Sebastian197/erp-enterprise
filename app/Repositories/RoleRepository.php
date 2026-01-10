<?php

namespace App\Repositories;

use Spatie\Permission\Models\Role;

/**
 * Role Repository
 *
 * Handles data access for roles
 */
class RoleRepository extends BaseRepository
{
    /**
     * RoleRepository constructor.
     *
     * @param Role $model
     */
    public function __construct(Role $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all roles with their permissions
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getWithPermissions()
    {
        return $this->model->with('permissions')->get();
    }

    /**
     * Find role by name
     *
     * @param string $name
     * @return Role|null
     */
    public function getByName(string $name): ?Role
    {
        return $this->model->where('name', $name)->first();
    }

    /**
     * Get all roles with pagination
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], int $perPage = 15)
    {
        $query = $this->model->with('permissions');

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Get role with permissions by ID
     *
     * @param int $id
     * @return Role|null
     */
    public function findWithPermissions(int $id): ?Role
    {
        return $this->model->with('permissions')->find($id);
    }

    /**
     * Attach permissions to role
     *
     * @param Role $role
     * @param array $permissionIds
     * @return void
     */
    public function attachPermissions(Role $role, array $permissionIds): void
    {
        $role->permissions()->attach($permissionIds);
    }

    /**
     * Detach permissions from role
     *
     * @param Role $role
     * @param array $permissionIds
     * @return void
     */
    public function detachPermissions(Role $role, array $permissionIds): void
    {
        $role->permissions()->detach($permissionIds);
    }

    /**
     * Sync permissions to role
     *
     * @param Role $role
     * @param array $permissionIds
     * @return void
     */
    public function syncPermissions(Role $role, array $permissionIds): void
    {
        $role->permissions()->sync($permissionIds);
    }

    /**
     * Get users count for a role
     *
     * @param Role $role
     * @return int
     */
    public function getUsersCount(Role $role): int
    {
        return $role->users()->count();
    }
}
