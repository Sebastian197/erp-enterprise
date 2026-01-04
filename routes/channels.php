<?php


use Illuminate\Support\Facades\Broadcast;

/**
 * Default user private channel
 */
Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/**
 * Admin channel - Only users with Super Admin or Admin role can join
 */
Broadcast::channel('admin', function ($user) {
    return $user->hasAnyRole(['Super Admin', 'Admin']);
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
