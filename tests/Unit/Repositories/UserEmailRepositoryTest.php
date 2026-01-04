<?php

use App\Enums\EmailType;
use App\Models\User;
use App\Models\UserEmail;
use App\Repositories\UserEmailRepository;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->repository = new UserEmailRepository();
    $this->user = User::factory()->create();
});

test('it can get all user emails', function () {
    UserEmail::factory()->count(3)->create(['user_id' => $this->user->id]);

    $emails = $this->repository->getAll();

    expect($emails)->toHaveCount(3);
});

test('it can filter emails by user', function () {
    $user2 = User::factory()->create();
    UserEmail::factory()->count(2)->create(['user_id' => $this->user->id]);
    UserEmail::factory()->count(3)->create(['user_id' => $user2->id]);

    $userEmails = $this->repository->getAll(['user_id' => $this->user->id]);

    expect($userEmails)->toHaveCount(2);
});

test('it can filter emails by primary status', function () {
    UserEmail::factory()->create(['user_id' => $this->user->id, 'is_primary' => true]);
    UserEmail::factory()->count(2)->create(['user_id' => $this->user->id, 'is_primary' => false]);

    $primaryEmails = $this->repository->getAll(['is_primary' => true]);

    expect($primaryEmails)->toHaveCount(1);
});

test('it can find email by id', function () {
    $email = UserEmail::factory()->create(['user_id' => $this->user->id]);

    $found = $this->repository->findById($email->id);

    expect($found)->not->toBeNull()
        ->and($found->id)->toBe($email->id);
});

test('it can find user by email address', function () {
    $email = UserEmail::factory()->create([
        'user_id' => $this->user->id,
        'email' => 'test@example.com'
    ]);

    $found = $this->repository->findByEmail('test@example.com');

    expect($found)->not->toBeNull()
        ->and($found->email)->toBe('test@example.com')
        ->and($found->user_id)->toBe($this->user->id);
});

test('it loads user relationship when finding by email', function () {
    UserEmail::factory()->create([
        'user_id' => $this->user->id,
        'email' => 'test@example.com'
    ]);

    $found = $this->repository->findByEmail('test@example.com');

    expect($found->relationLoaded('user'))->toBeTrue();
});

test('it can create a user email', function () {
    $data = [
        'user_id' => $this->user->id,
        'email' => 'new@example.com',
        'type' => EmailType::Personal,
        'is_primary' => true,
    ];

    $email = $this->repository->create($data);

    expect($email)->toBeInstanceOf(UserEmail::class)
        ->and($email->email)->toBe('new@example.com')
        ->and($email->is_primary)->toBeTrue();
});

test('it can update a user email', function () {
    $email = UserEmail::factory()->create([
        'user_id' => $this->user->id,
        'type' => EmailType::Personal
    ]);

    $updated = $this->repository->update($email, ['type' => EmailType::Work]);

    expect($updated->type)->toBe(EmailType::Work);
});

test('it can delete a user email', function () {
    $email = UserEmail::factory()->create(['user_id' => $this->user->id]);

    $result = $this->repository->delete($email);

    expect($result)->toBeTrue()
        ->and(UserEmail::find($email->id))->toBeNull();
});

test('it ensures one primary email per user', function () {
    // Create multiple non-primary emails
    UserEmail::factory()->count(3)->create([
        'user_id' => $this->user->id,
        'is_primary' => false
    ]);

    // Call ensure method
    $this->repository->ensureOnePrimary($this->user);

    // Should have exactly one primary
    $primaryCount = UserEmail::where('user_id', $this->user->id)
        ->where('is_primary', true)
        ->count();

    expect($primaryCount)->toBe(1);
});

test('it does nothing if user already has primary email', function () {
    $primaryEmail = UserEmail::factory()->create([
        'user_id' => $this->user->id,
        'is_primary' => true,
        'email' => 'primary@example.com'
    ]);
    UserEmail::factory()->count(2)->create([
        'user_id' => $this->user->id,
        'is_primary' => false
    ]);

    $this->repository->ensureOnePrimary($this->user);

    $primary = UserEmail::where('user_id', $this->user->id)
        ->where('is_primary', true)
        ->first();

    expect($primary->email)->toBe('primary@example.com');
});
