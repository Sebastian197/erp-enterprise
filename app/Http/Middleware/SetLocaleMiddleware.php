<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetLocaleMiddleware
{
    /**
     * Supported locales for the application.
     */
    private const SUPPORTED_LOCALES = [
        'en', // English
        'es', // Spanish
        'fr', // French
        'de', // German
        'it', // Italian
        'pt', // Portuguese
        'zh', // Chinese Simplified (symlink to zh_CN)
        'zh_CN', // Chinese Simplified
        'ja', // Japanese
        'ar', // Arabic
        'ru', // Russian
    ];

    /**
     * Default locale if none is specified.
     */
    private const DEFAULT_LOCALE = 'en';

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->determineLocale($request);

        if ($this->isLocaleSupported($locale)) {
            App::setLocale($locale);
        } else {
            App::setLocale(self::DEFAULT_LOCALE);
        }

        return $next($request);
    }

    /**
     * Determine the locale to use based on various sources.
     */
    private function determineLocale(Request $request): string
    {
        // 1. Check if user is authenticated and has a locale preference
        if (Auth::check()) {
            $user = Auth::user();
            if ($user->preference && $user->preference->locale) {
                return $user->preference->locale;
            }
        }

        // 2. Check for locale in query parameter
        if ($request->has('locale')) {
            $queryLocale = $request->query('locale');
            if (is_string($queryLocale) && $this->isLocaleSupported($queryLocale)) {
                return $queryLocale;
            }
        }

        // 3. Check for locale in session (only if session is available)
        if ($request->hasSession() && $request->session()->has('locale')) {
            $sessionLocale = $request->session()->get('locale');
            if (is_string($sessionLocale) && $this->isLocaleSupported($sessionLocale)) {
                return $sessionLocale;
            }
        }

        // 4. Check Accept-Language header
        $headerLocale = $request->getPreferredLanguage(self::SUPPORTED_LOCALES);
        if ($headerLocale && $this->isLocaleSupported($headerLocale)) {
            return $headerLocale;
        }

        // 5. Fall back to default locale
        return self::DEFAULT_LOCALE;
    }

    /**
     * Check if the given locale is supported.
     */
    private function isLocaleSupported(string $locale): bool
    {
        return in_array($locale, self::SUPPORTED_LOCALES, true);
    }
}