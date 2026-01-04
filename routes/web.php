<?php

use Illuminate\Support\Facades\Route;

// Catch-all route for Vue Router - serves the Vue app for all routes
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
