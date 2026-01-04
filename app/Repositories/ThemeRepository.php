<?php

namespace App\Repositories;

use App\Models\Theme;
use Illuminate\Database\Eloquent\Collection;

/**
 * ThemeRepository
 *
 * Handles data access operations for Theme model.
 */
class ThemeRepository
{
    /**
     * Get all themes with optional filters.
     *
     * @param array $filters
     * @return Collection
     */
    public function getAll(array $filters = []): Collection
    {
        $query = Theme::query();

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        return $query->get();
    }

    /**
     * Get all active themes.
     *
     * @return Collection
     */
    public function getActive(): Collection
    {
        return Theme::where('is_active', true)->get();
    }

    /**
     * Get the default theme.
     *
     * @return Theme|null
     */
    public function getDefault(): ?Theme
    {
        return Theme::where('is_default', true)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Find theme by ID.
     *
     * @param int $id
     * @return Theme|null
     */
    public function findById(int $id): ?Theme
    {
        return Theme::find($id);
    }

    /**
     * Create a new theme.
     *
     * @param array $data
     * @return Theme
     */
    public function create(array $data): Theme
    {
        return Theme::create($data);
    }

    /**
     * Update theme.
     *
     * @param Theme $theme
     * @param array $data
     * @return Theme
     */
    public function update(Theme $theme, array $data): Theme
    {
        $theme->update($data);
        return $theme->fresh();
    }

    /**
     * Delete theme.
     *
     * @param Theme $theme
     * @return bool
     */
    public function delete(Theme $theme): bool
    {
        return $theme->delete();
    }
}