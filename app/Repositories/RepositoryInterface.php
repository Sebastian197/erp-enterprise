<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Collection;

/**
 * Base Repository Interface
 */
interface RepositoryInterface
{
    /**
     * Get all records
     *
     * @param array $relations
     * @return Collection
     */
    public function getAll(array $relations = []): Collection;

    /**
     * Find a record by ID
     *
     * @param int $id
     * @param array $relations
     * @return Model|null
     */
    public function findById(int $id, array $relations = []): ?Model;

    /**
     * Create a new record
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Update a record
     *
     * @param Model $model
     * @param array $data
     * @return bool
     */
    public function update(Model $model, array $data): bool;

    /**
     * Delete a record
     *
     * @param Model $model
     * @return bool|null
     */
    public function delete(Model $model): ?bool;
}
