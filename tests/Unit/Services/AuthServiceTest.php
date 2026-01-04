<?php

use App\Enums\EmailType;
use App\Enums\UserStatus;
use App\Models\User;
use App\Models\UserEmail;
use App\Repositories\UserEmailRepository;
use App\Repositories\UserRepository;
use App\Services\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\UnauthorizedException;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->userRepository = new UserRepository();
    $this->userEmailRepository = new UserEmailRepository();
    $this->service = new AuthService($this->userRepository, $this->userEmailRepository);
});

test('it can login with valid credentials', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
        'status' => UserStatus::Active,
    ]);
    UserEmail::factory()->create([
        'user_id' => $user->id,
        'email' => 'test@example.com',
        'is_primary' => true,
    ]);

    $result = $this->service->login('test@example.com', 'password123');

    expect($result)->toHaveKeys(['user', 'token'])
        ->and($result['user'])->toBeInstanceOf(User::class)
        ->and($result['user']->id)->toBe($user->id)
        ->and($result['token'])->toBeString();
});

test('it throws exception with invalid email', function () {
    $this->service->login('nonexistent@example.com', 'password123');
})->throws(UnauthorizedException::class, 'Invalid credentials.');

test('it throws exception with invalid password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('correctpassword'),
        'status' => UserStatus::Active,
    ]);
    UserEmail::factory()->create([
        'user_id' => $user->id,
        'email' => 'test@example.com',
    ]);

    $this->service->login('test@example.com', 'wrongpassword');
})->throws(UnauthorizedException::class, 'Invalid credentials.');

test('it throws exception for inactive user', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
        'status' => UserStatus::Inactive,
    ]);
    UserEmail::factory()->create([
        'user_id' => $user->id,
        'email' => 'test@example.com',
    ]);

    $this->service->login('test@example.com', 'password123');
})->throws(UnauthorizedException::class, 'Account is not active.');

test('it loads user relationships on login', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
        'status' => UserStatus::Active,
    ]);
    UserEmail::factory()->create([
        'user_id' => $user->id,
        'email' => 'test@example.com',
    ]);

    $result = $this->service->login('test@example.com', 'password123');

    expect($result['user']->relationLoaded('emails'))->toBeTrue()
        ->and($result['user']->relationLoaded('phones'))->toBeTrue()
        ->and($result['user']->relationLoaded('preference'))->toBeTrue();
});

test('it can create token for user', function () {
    $user = User::factory()->create();

    $token = $this->service->createToken($user);

    expect($token)->toBeString()
        ->and($user->tokens()->count())->toBe(1);
});

test('it can create token with custom name', function () {
    $user = User::factory()->create();

    $token = $this->service->createToken($user, 'custom-token');

    expect($user->tokens()->first()->name)->toBe('custom-token');
});

test('it can revoke all user tokens', function () {
    $user = User::factory()->create();
    $user->createToken('token1');
    $user->createToken('token2');
    $user->createToken('token3');

    $this->service->revokeTokens($user);

    expect($user->tokens()->count())->toBe(0);
});

test('it can update user profile', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'username' => 'oldusername',
    ]);

    $updated = $this->service->updateProfile($user, [
        'name' => 'New Name',
        'username' => 'newusername',
        'password' => 'shouldnotbeused', // Should be filtered out
    ]);

    expect($updated->name)->toBe('New Name')
        ->and($updated->username)->toBe('newusername');
});

test('it only updates allowed profile fields', function () {
    $user = User::factory()->create([
        'name' => 'Original Name',
        'status' => UserStatus::Active,
    ]);

    $updated = $this->service->updateProfile($user, [
        'name' => 'New Name',
        'status' => UserStatus::Inactive, // Should not be updated
    ]);

    expect($updated->name)->toBe('New Name')
        ->and($updated->status)->toBe(UserStatus::Active);
});

test('it can update user password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('oldpassword'),
    ]);

    $result = $this->service->updatePassword($user, 'newpassword');

    expect($result)->toBeTrue()
        ->and(Hash::check('newpassword', $user->fresh()->password))->toBeTrue();
});
