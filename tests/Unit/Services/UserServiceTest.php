<?php

use App\Enums\EmailType;
use App\Enums\UserStatus;
use App\Models\User;
use App\Models\UserEmail;
use App\Models\UserPhone;
use App\Repositories\UserEmailRepository;
use App\Repositories\UserPhoneRepository;
use App\Repositories\UserPreferenceRepository;
use App\Repositories\UserRepository;
use App\Services\UserService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->userRepository = new UserRepository();
    $this->userEmailRepository = new UserEmailRepository();
    $this->userPhoneRepository = new UserPhoneRepository();
    $this->userPreferenceRepository = new UserPreferenceRepository();

    $this->service = new UserService(
        $this->userRepository,
        $this->userEmailRepository,
        $this->userPhoneRepository,
        $this->userPreferenceRepository
    );

    // Create default role
    Role::create(['name' => 'user', 'guard_name' => 'web']);
});

test('it can get all users', function () {
    User::factory()->count(5)->create();

    $users = $this->service->getAll();

    expect($users)->toHaveCount(5);
});

test('it can create a user with minimum data', function () {
    $data = [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password123',
    ];

    $user = $this->service->create($data);

    expect($user)->toBeInstanceOf(User::class)
        ->and($user->name)->toBe('Test User')
        ->and($user->username)->toBe('testuser')
        ->and($user->emails)->toHaveCount(1)
        ->and($user->emails->first()->email)->toBe('test@example.com')
        ->and($user->emails->first()->is_primary)->toBeTrue();
});

test('it creates user preference on user creation', function () {
    $data = [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password123',
    ];

    $user = $this->service->create($data);

    expect($user->preference)->not->toBeNull()
        ->and($user->preference->locale)->toBe('en')
        ->and($user->preference->timezone)->toBe('UTC');
});

test('it assigns default role on user creation', function () {
    $data = [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password123',
    ];

    $user = $this->service->create($data);

    expect($user->hasRole('user'))->toBeTrue();
});

test('it can create user with custom role', function () {
    Role::create(['name' => 'admin', 'guard_name' => 'web']);

    $data = [
        'name' => 'Admin User',
        'username' => 'adminuser',
        'email' => 'admin@example.com',
        'password' => 'password123',
        'roles' => ['admin'],
    ];

    $user = $this->service->create($data);

    expect($user->hasRole('admin'))->toBeTrue()
        ->and($user->hasRole('user'))->toBeFalse();
});

test('it hashes password on user creation', function () {
    $data = [
        'name' => 'Test User',
        'username' => 'testuser',
        'email' => 'test@example.com',
        'password' => 'password123',
    ];

    $user = $this->service->create($data);

    expect(Hash::check('password123', $user->password))->toBeTrue();
});

test('it can update user', function () {
    $user = User::factory()->create(['name' => 'Old Name']);

    $updated = $this->service->update($user, ['name' => 'New Name']);

    expect($updated->name)->toBe('New Name');
});

test('it can update user password', function () {
    $user = User::factory()->create();

    $updated = $this->service->update($user, ['password' => 'newpassword']);

    expect(Hash::check('newpassword', $updated->password))->toBeTrue();
});

test('it can delete user and related data', function () {
    $user = User::factory()->create();
    UserEmail::factory()->create(['user_id' => $user->id]);
    UserPhone::factory()->create(['user_id' => $user->id]);
    $user->createToken('test-token');

    $result = $this->service->delete($user);

    expect($result)->toBeTrue()
        ->and(User::find($user->id))->toBeNull()
        ->and(UserEmail::where('user_id', $user->id)->count())->toBe(0)
        ->and(UserPhone::where('user_id', $user->id)->count())->toBe(0);
});

test('it can add email to user', function () {
    $user = User::factory()->create();

    $email = $this->service->addEmail($user, [
        'email' => 'new@example.com',
        'type' => EmailType::Work,
        'is_primary' => false,
    ]);

    expect($email)->toBeInstanceOf(UserEmail::class)
        ->and($email->email)->toBe('new@example.com')
        ->and($email->type)->toBe(EmailType::Work);
});

test('it can add phone to user', function () {
    $user = User::factory()->create();

    $phone = $this->service->addPhone($user, [
        'phone' => '+1234567890',
        'is_primary' => true,
    ]);

    expect($phone)->toBeInstanceOf(UserPhone::class)
        ->and($phone->phone)->toBe('+1234567890');
});

test('it can remove email from user', function () {
    $user = User::factory()->create();
    UserEmail::factory()->create(['user_id' => $user->id, 'is_primary' => true]);
    $email = UserEmail::factory()->create(['user_id' => $user->id, 'is_primary' => false]);

    $result = $this->service->removeEmail($email);

    expect($result)->toBeTrue()
        ->and(UserEmail::find($email->id))->toBeNull();
});

test('it cannot remove last email', function () {
    $user = User::factory()->create();
    $email = UserEmail::factory()->create(['user_id' => $user->id]);

    $this->service->removeEmail($email);
})->throws(Exception::class, 'Cannot remove the last email address.');

test('it can remove phone from user', function () {
    $user = User::factory()->create();
    $phone = UserPhone::factory()->create(['user_id' => $user->id]);

    $result = $this->service->removePhone($phone);

    expect($result)->toBeTrue()
        ->and(UserPhone::find($phone->id))->toBeNull();
});

test('it can assign categories to user', function () {
    $user = User::factory()->create();
    $categories = \App\Models\Category::factory()->count(3)->create();

    $this->actingAs($user);
    $this->service->assignCategories($user, $categories->pluck('id')->toArray());

    expect($user->fresh()->categories)->toHaveCount(3);
});

test('it can assign roles to user', function () {
    Role::create(['name' => 'admin', 'guard_name' => 'web']);
    Role::create(['name' => 'manager', 'guard_name' => 'web']);
    $user = User::factory()->create();

    $this->service->assignRoles($user, ['admin', 'manager']);

    expect($user->fresh()->roles)->toHaveCount(2)
        ->and($user->hasRole('admin'))->toBeTrue()
        ->and($user->hasRole('manager'))->toBeTrue();
});

test('it syncs roles when assigning', function () {
    Role::create(['name' => 'admin', 'guard_name' => 'web']);
    Role::create(['name' => 'manager', 'guard_name' => 'web']);
    $user = User::factory()->create();
    $user->assignRole('user');

    $this->service->assignRoles($user, ['admin']);

    expect($user->fresh()->roles)->toHaveCount(1)
        ->and($user->hasRole('admin'))->toBeTrue()
        ->and($user->hasRole('user'))->toBeFalse();
});
