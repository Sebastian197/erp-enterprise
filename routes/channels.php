<?php


use Illuminate\Support\Facades\Broadcast;

/**
 * Default user private channel
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/**
 * Admin channel - Super Admin, Admin role, or privileged groups can join
 */
Broadcast::channel('admin', function ($user) {
    // Load roles if not already loaded
    if (!$user->relationLoaded('roles')) {
        $user->load('roles');
    }

    // Load group if not already loaded
    if (!$user->relationLoaded('group')) {
        $user->load('group');
    }

    // Allow Super Admin or Admin roles
    if ($user->hasAnyRole(['Super Admin', 'Admin'])) {
        return true;
    }

    // Allow privileged groups
    if ($user->isPrivilegedGroup()) {
        return true;
    }

    return false;
});

/**
 * User notifications channel - Only the user themselves can join
 */
Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

/**
 * User private channel - Only the user themselves can join
 */
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
