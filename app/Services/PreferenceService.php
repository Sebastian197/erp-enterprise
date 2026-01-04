<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPreference;
use App\Repositories\ThemeRepository;
use App\Repositories\UserPreferenceRepository;

/**
 * PreferenceService
 *
 * Handles user preference management business logic.
 */
class PreferenceService
{
    public function __construct(
        protected UserPreferenceRepository $userPreferenceRepository,
        protected ThemeRepository $themeRepository
    ) {}

    /**
     * Get user preference or create if not exists.
     *
     * @param User $user
     * @return UserPreference
     */
    public function getUserPreference(User $user): UserPreference
    {
        $preference = $this->userPreferenceRepository->findByUser($user);

        if (!$preference) {
            // Create default preference
            $defaultTheme = $this->themeRepository->getDefault();

            $preference = $this->userPreferenceRepository->create([
                'user_id' => $user->id,
                'locale' => 'en',
                'timezone' => 'UTC',
                'theme_id' => $defaultTheme?->id,
            ]);
        }

        return $preference;
    }

    /**
     * Update user preference.
     *
     * @param User $user
     * @param array $data
     * @return UserPreference
     */
    public function updatePreference(User $user, array $data): UserPreference
    {
        $preference = $this->getUserPreference($user);

        $allowedFields = ['locale', 'timezone', 'theme_id'];
        $updateData = array_intersect_key($data, array_flip($allowedFields));

        return $this->userPreferenceRepository->update($preference, $updateData);
    }

    /**
     * Update user locale.
     *
     * @param User $user
     * @param string $locale
     * @return UserPreference
     */
    public function updateLocale(User $user, string $locale): UserPreference
    {
        $preference = $this->getUserPreference($user);

        return $this->userPreferenceRepository->update($preference, [
            'locale' => $locale,
        ]);
    }

    /**
     * Update user theme.
     *
     * @param User $user
     * @param int $themeId
     * @return UserPreference
     * @throws \Exception
     */
    public function updateTheme(User $user, int $themeId): UserPreference
    {
        // Verify theme exists and is active
        $theme = $this->themeRepository->findById($themeId);

        if (!$theme || !$theme->is_active) {
            throw new \Exception('Theme not found or is not active.');
        }

        $preference = $this->getUserPreference($user);

        return $this->userPreferenceRepository->update($preference, [
            'theme_id' => $themeId,
        ]);
    }
}