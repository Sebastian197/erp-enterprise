<?php

namespace App\Models;

use App\Enums\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * User Model
 *
 * @property int $id
 * @property string $name
 * @property string $username
 * @property string $password
 * @property string|null $avatar
 * @property UserStatus $status
 * @property int|null $group_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read Group|null $group
 * @property-read \Illuminate\Database\Eloquent\Collection<int, UserEmail> $emails
 * @property-read \Illuminate\Database\Eloquent\Collection<int, UserPhone> $phones
 * @property-read UserPreference|null $preference
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Category> $categories
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'password',
        'avatar',
        'status',
        'group_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'status' => UserStatus::class,
        ];
    }

    /**
     * Get the group that the user belongs to.
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * Get the user's email addresses.
     */
    public function emails(): HasMany
    {
        return $this->hasMany(UserEmail::class);
    }

    /**
     * Get the user's phone numbers.
     */
    public function phones(): HasMany
    {
        return $this->hasMany(UserPhone::class);
    }

    /**
     * Get the user's preference.
     */
    public function preference(): HasOne
    {
        return $this->hasOne(UserPreference::class);
    }

    /**
     * Get the categories assigned to the user.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'user_categories')
            ->withPivot('is_primary', 'assigned_at', 'assigned_by')
            ->withTimestamps();
    }

    /**
     * Get the primary category for the user.
     */
    public function primaryCategory(): ?Category
    {
        return $this->categories()
            ->wherePivot('is_primary', true)
            ->first();
    }

    /**
     * Override Spatie's permissions relationship to include is_negative pivot.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions(): BelongsToMany
    {
        $relation = $this->morphToMany(
            config('permission.models.permission'),
            'model',
            config('permission.table_names.model_has_permissions'),
            config('permission.column_names.model_morph_key'),
            'permission_id'
        );

        return $relation->withPivot('is_negative');
    }

    /**
     * Check if user has an explicit deny permission (negative permission).
     *
     * @param string $ability The permission name (e.g., 'users.delete')
     * @return bool True if permission is explicitly denied
     */
    public function hasExplicitDenyPermission(string $ability): bool
    {
        return $this->permissions()
            ->wherePivot('is_negative', true)
            ->where('name', $ability)
            ->exists();
    }

    /**
     * Check if user belongs to a privileged group.
     * Privileged groups have automatic access to all features unless explicitly denied.
     *
     * @return bool True if user is in Administradores or Webmaster group
     */
    public function isPrivilegedGroup(): bool
    {
        return $this->group && in_array($this->group->name, ['Administradores', 'Webmaster']);
    }
}
