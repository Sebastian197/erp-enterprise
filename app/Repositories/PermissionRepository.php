<?php

namespace App\Repositories;

use Spatie\Permission\Models\Permission;

/**
 * Permission Repository
 *
 * Handles data access for permissions
 */
class PermissionRepository extends BaseRepository
{
    /**
     * PermissionRepository constructor.
     *
     * @param Permission $model
     */
    public function __construct(Permission $model)
    {
        parent::__construct($model);
    }

    /**
     * Get permissions by group/module
     *
     * @param string $group
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByGroup(string $group)
    {
        return $this->model->where('name', 'like', "{$group}.%")->get();
    }

    /**
     * Search permissions by name
     *
     * @param string $search
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function searchByName(string $search)
    {
        return $this->model->where('name', 'like', "%{$search}%")->get();
    }

    /**
     * Get all permissions with pagination
     *
     * @param array $filters
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], int $perPage = 15)
    {
        $query = $this->model->newQuery();

        if (!empty($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%");
        }

        if (!empty($filters['group'])) {
            $query->where('name', 'like', "{$filters['group']}.%");
        }

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Find permission by name
     *
     * @param string $name
     * @return Permission|null
     */
    public function findByName(string $name): ?Permission
    {
        return $this->model->where('name', $name)->first();
    }
}
