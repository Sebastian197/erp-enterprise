<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\PreferenceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes (no authentication required)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);
});

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
        Route::put('/user', [AuthController::class, 'updateProfile']);
        Route::put('/user/password', [AuthController::class, 'updatePassword']);
    });

    // User management
    Route::apiResource('users', UserController::class);
    Route::post('users/{user}/emails', [UserController::class, 'addEmail']);
    Route::post('users/{user}/phones', [UserController::class, 'addPhone']);
    Route::delete('users/emails/{email}', [UserController::class, 'removeEmail']);
    Route::delete('users/phones/{phone}', [UserController::class, 'removePhone']);

    // Groups
    Route::apiResource('groups', GroupController::class);

    // Categories
    Route::apiResource('categories', CategoryController::class);
    Route::post('categories/{category}/costs', [CategoryController::class, 'updateCosts']);

    // Themes
    Route::get('themes', [ThemeController::class, 'index']);
    Route::get('themes/{theme}', [ThemeController::class, 'show']);

    // User preferences
    Route::get('preferences', [PreferenceController::class, 'show']);
    Route::put('preferences', [PreferenceController::class, 'update']);
    Route::put('preferences/locale', [PreferenceController::class, 'updateLocale']);
    Route::put('preferences/theme', [PreferenceController::class, 'updateTheme']);
});
