<?php

use App\Enums\UserStatus;
use App\Models\User;
use App\Models\UserEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'password' => Hash::make('password123'),
        'status' => UserStatus::Active,
    ]);
    $this->email = UserEmail::factory()->create([
        'user_id' => $this->user->id,
        'email' => 'test@example.com',
        'is_primary' => true,
    ]);
});

test('user can login with valid credentials', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'data' => [
                'user',
                'token',
            ],
        ]);
});

test('user cannot login with invalid email', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'wrong@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Invalid credentials.',
        ]);
});

test('user cannot login with invalid password', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Invalid credentials.',
        ]);
});

test('inactive user cannot login', function () {
    $this->user->update(['status' => UserStatus::Inactive]);

    $response = $this->postJson('/api/auth/login', [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Account is not active.',
        ]);
});

test('login requires email and password', function () {
    $response = $this->postJson('/api/auth/login', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'password']);
});

test('login requires valid email format', function () {
    $response = $this->postJson('/api/auth/login', [
        'email' => 'invalid-email',
        'password' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('authenticated user can logout', function () {
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->postJson('/api/auth/logout');

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Logout successful',
        ]);

    expect($this->user->tokens()->count())->toBe(0);
});

test('authenticated user can get their data', function () {
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->getJson('/api/auth/user');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                'id',
                'name',
                'username',
                'status',
                'emails',
                'phones',
                'preference',
                'group',
                'categories',
                'roles',
                'permissions',
            ],
        ]);
});

test('unauthenticated user cannot access user endpoint', function () {
    $response = $this->getJson('/api/auth/user');

    $response->assertStatus(401);
});

test('authenticated user can update profile', function () {
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->putJson('/api/auth/profile', [
        'name' => 'Updated Name',
        'username' => 'updatedusername',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Profile updated successfully',
        ]);

    expect($this->user->fresh()->name)->toBe('Updated Name')
        ->and($this->user->fresh()->username)->toBe('updatedusername');
});

test('user cannot update profile with duplicate username', function () {
    $otherUser = User::factory()->create(['username' => 'existinguser']);
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->putJson('/api/auth/profile', [
        'username' => 'existinguser',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['username']);
});

test('authenticated user can update password', function () {
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->putJson('/api/auth/password', [
        'current_password' => 'password123',
        'new_password' => 'newpassword123',
        'new_password_confirmation' => 'newpassword123',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'message' => 'Password updated successfully',
        ]);

    expect(Hash::check('newpassword123', $this->user->fresh()->password))->toBeTrue();
});

test('user cannot update password with wrong current password', function () {
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->putJson('/api/auth/password', [
        'current_password' => 'wrongpassword',
        'new_password' => 'newpassword123',
        'new_password_confirmation' => 'newpassword123',
    ]);

    $response->assertStatus(422)
        ->assertJson([
            'message' => 'Current password is incorrect',
        ]);
});

test('password update requires confirmation', function () {
    $token = $this->user->createToken('test-token')->plainTextToken;

    $response = $this->withHeaders([
        'Authorization' => "Bearer $token",
    ])->putJson('/api/auth/password', [
        'current_password' => 'password123',
        'new_password' => 'newpassword123',
        'new_password_confirmation' => 'differentpassword',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['new_password']);
});
