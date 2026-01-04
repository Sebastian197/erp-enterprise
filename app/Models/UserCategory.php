<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * UserCategory Model (Pivot)
 *
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property bool $is_primary
 * @property \Illuminate\Support\Carbon|null $assigned_at
 * @property int|null $assigned_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read User $user
 * @property-read Category $category
 * @property-read User|null $assignedBy
 */
class UserCategory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'is_primary',
        'assigned_at',
        'assigned_by',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_primary' => 'boolean',
            'assigned_at' => 'datetime',
        ];
    }

    /**
     * Boot the model.
     */
    protected static function booted(): void
    {
        static::saving(function (UserCategory $userCategory) {
            // If setting this as primary, remove primary from other categories for this user
            if ($userCategory->is_primary) {
                static::where('user_id', $userCategory->user_id)
                    ->where('id', '!=', $userCategory->id ?? 0)
                    ->update(['is_primary' => false]);
            }
        });
    }

    /**
     * Get the user that this assignment belongs to.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that this assignment belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the user who made this assignment.
     */
    public function assignedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}