<?php

namespace App\Services;

use App\Models\Theme;
use App\Repositories\ThemeRepository;
use Illuminate\Database\Eloquent\Collection;

/**
 * ThemeService
 *
 * Handles theme management business logic.
 */
class ThemeService
{
    public function __construct(
        protected ThemeRepository $themeRepository
    ) {}

    /**
     * Get all active themes.
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return $this->themeRepository->getActive();
    }

    /**
     * Get theme by ID.
     *
     * @param int $id
     * @return Theme|null
     */
    public function getById(int $id): ?Theme
    {
        return $this->themeRepository->findById($id);
    }

    /**
     * Get default theme.
     *
     * @return Theme|null
     */
    public function getDefault(): ?Theme
    {
        return $this->themeRepository->getDefault();
    }
}