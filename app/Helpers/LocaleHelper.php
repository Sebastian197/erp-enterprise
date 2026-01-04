<?php

declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Support\Facades\App;

class LocaleHelper
{
    /**
     * Supported locales with their native names.
     */
    private const SUPPORTED_LOCALES = [
        'en' => 'English',
        'es' => 'Español',
        'fr' => 'Français',
        'de' => 'Deutsch',
        'it' => 'Italiano',
        'pt' => 'Português',
        'zh' => '简体中文',
        'zh_CN' => '简体中文',
        'ja' => '日本語',
        'ar' => 'العربية',
        'ru' => 'Русский',
    ];

    /**
     * Right-to-left locales.
     */
    private const RTL_LOCALES = ['ar'];

    /**
     * Default locale.
     */
    private const DEFAULT_LOCALE = 'en';

    /**
     * Get all supported locales.
     *
     * @return array<string, string>
     */
    public static function getSupportedLocales(): array
    {
        return self::SUPPORTED_LOCALES;
    }

    /**
     * Get array of locale codes only.
     *
     * @return array<int, string>
     */
    public static function getSupportedLocaleCodes(): array
    {
        return array_keys(self::SUPPORTED_LOCALES);
    }

    /**
     * Check if a locale is supported.
     */
    public static function isLocaleSupported(string $locale): bool
    {
        return array_key_exists($locale, self::SUPPORTED_LOCALES);
    }

    /**
     * Get the default locale.
     */
    public static function getDefaultLocale(): string
    {
        return self::DEFAULT_LOCALE;
    }

    /**
     * Get the current locale.
     */
    public static function getCurrentLocale(): string
    {
        return App::getLocale();
    }

    /**
     * Get the native name of a locale.
     */
    public static function getLocaleName(string $locale): string
    {
        return self::SUPPORTED_LOCALES[$locale] ?? $locale;
    }

    /**
     * Get the native name of the current locale.
     */
    public static function getCurrentLocaleName(): string
    {
        return self::getLocaleName(self::getCurrentLocale());
    }

    /**
     * Check if the given locale is right-to-left.
     */
    public static function isRtl(string $locale): bool
    {
        return in_array($locale, self::RTL_LOCALES, true);
    }

    /**
     * Check if the current locale is right-to-left.
     */
    public static function isCurrentRtl(): bool
    {
        return self::isRtl(self::getCurrentLocale());
    }

    /**
     * Get the direction for the given locale (ltr or rtl).
     */
    public static function getDirection(string $locale): string
    {
        return self::isRtl($locale) ? 'rtl' : 'ltr';
    }

    /**
     * Get the direction for the current locale (ltr or rtl).
     */
    public static function getCurrentDirection(): string
    {
        return self::getDirection(self::getCurrentLocale());
    }

    /**
     * Get locales grouped by region.
     *
     * @return array<string, array<string, string>>
     */
    public static function getLocalesByRegion(): array
    {
        return [
            'European' => [
                'en' => self::SUPPORTED_LOCALES['en'],
                'es' => self::SUPPORTED_LOCALES['es'],
                'fr' => self::SUPPORTED_LOCALES['fr'],
                'de' => self::SUPPORTED_LOCALES['de'],
                'it' => self::SUPPORTED_LOCALES['it'],
                'pt' => self::SUPPORTED_LOCALES['pt'],
                'ru' => self::SUPPORTED_LOCALES['ru'],
            ],
            'Asian' => [
                'zh' => self::SUPPORTED_LOCALES['zh'],
                'ja' => self::SUPPORTED_LOCALES['ja'],
            ],
            'Middle Eastern' => [
                'ar' => self::SUPPORTED_LOCALES['ar'],
            ],
        ];
    }

    /**
     * Format a locale code to include the region (e.g., en_US, es_ES).
     * This is useful for date/number formatting libraries.
     */
    public static function formatLocaleCode(string $locale): string
    {
        $localeMap = [
            'en' => 'en_US',
            'es' => 'es_ES',
            'fr' => 'fr_FR',
            'de' => 'de_DE',
            'it' => 'it_IT',
            'pt' => 'pt_BR',
            'zh' => 'zh_CN',
            'zh_CN' => 'zh_CN',
            'ja' => 'ja_JP',
            'ar' => 'ar_SA',
            'ru' => 'ru_RU',
        ];

        return $localeMap[$locale] ?? $locale;
    }
}
