<?php

use App\Enums\UserStatus;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->repository = new UserRepository();
});

test('it can get all users', function () {
    User::factory()->count(5)->create();

    $users = $this->repository->getAll();

    expect($users)->toHaveCount(5);
});

test('it can filter users by status', function () {
    User::factory()->count(3)->create(['status' => UserStatus::Active]);
    User::factory()->count(2)->create(['status' => UserStatus::Inactive]);

    $activeUsers = $this->repository->getAll(['status' => UserStatus::Active]);

    expect($activeUsers)->toHaveCount(3);
});

test('it can filter users by group', function () {
    $group = \App\Models\Group::factory()->create();
    User::factory()->count(3)->create(['group_id' => $group->id]);
    User::factory()->count(2)->create();

    $groupUsers = $this->repository->getAll(['group_id' => $group->id]);

    expect($groupUsers)->toHaveCount(3);
});

test('it can search users by name or username', function () {
    User::factory()->create(['name' => 'John Doe', 'username' => 'johndoe']);
    User::factory()->create(['name' => 'Jane Smith', 'username' => 'janesmith']);
    User::factory()->create(['name' => 'Bob Wilson', 'username' => 'bobwilson']);

    $results = $this->repository->getAll(['search' => 'John']);

    expect($results)->toHaveCount(1)
        ->and($results->first()->name)->toBe('John Doe');
});

test('it can find user by id', function () {
    $user = User::factory()->create();

    $found = $this->repository->findById($user->id);

    expect($found)->not->toBeNull()
        ->and($found->id)->toBe($user->id);
});

test('it returns null when user not found by id', function () {
    $found = $this->repository->findById(999);

    expect($found)->toBeNull();
});

test('it can find user by username', function () {
    $user = User::factory()->create(['username' => 'testuser']);

    $found = $this->repository->findByUsername('testuser');

    expect($found)->not->toBeNull()
        ->and($found->username)->toBe('testuser');
});

test('it can create a user', function () {
    $data = [
        'name' => 'Test User',
        'username' => 'testuser',
        'password' => bcrypt('password'),
        'status' => UserStatus::Active,
    ];

    $user = $this->repository->create($data);

    expect($user)->toBeInstanceOf(User::class)
        ->and($user->name)->toBe('Test User')
        ->and($user->username)->toBe('testuser');
});

test('it can update a user', function () {
    $user = User::factory()->create(['name' => 'Old Name']);

    $updated = $this->repository->update($user, ['name' => 'New Name']);

    expect($updated->name)->toBe('New Name');
});

test('it can delete a user', function () {
    $user = User::factory()->create();

    $result = $this->repository->delete($user);

    expect($result)->toBeTrue()
        ->and(User::find($user->id))->toBeNull();
});

test('it loads relationships when getting all users', function () {
    $user = User::factory()->create();
    \App\Models\UserEmail::factory()->create(['user_id' => $user->id]);

    $users = $this->repository->getAll();

    expect($users->first()->relationLoaded('emails'))->toBeTrue()
        ->and($users->first()->relationLoaded('phones'))->toBeTrue()
        ->and($users->first()->relationLoaded('group'))->toBeTrue();
});
