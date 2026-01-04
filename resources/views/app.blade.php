<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'ERP Enterprise') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">

    <!-- Styles -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Additional Meta Tags -->
    <meta name="description" content="{{ config('app.name') }} - Enterprise Resource Planning System">
    <meta name="keywords" content="ERP, Enterprise, Management, System">
    <meta name="author" content="{{ config('app.name') }}">
    <meta name="robots" content="noindex, nofollow">

    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
</head>
<body class="antialiased">
    <!-- Vue App Mount Point -->
    <div id="app"></div>

    <!-- Noscript Fallback -->
    <noscript>
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 2rem;">
            <div>
                <h1 style="font-size: 2rem; margin-bottom: 1rem;">JavaScript Required</h1>
                <p style="font-size: 1.125rem; color: #666;">
                    Please enable JavaScript in your browser to use {{ config('app.name') }}.
                </p>
            </div>
        </div>
    </noscript>
</body>
</html>