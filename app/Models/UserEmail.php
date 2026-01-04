<?php

namespace App\Models;

use App\Enums\EmailType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * UserEmail Model
 *
 * @property int $id
 * @property int $user_id
 * @property string $email
 * @property EmailType $type
 * @property bool $is_primary
 * @property \Illuminate\Support\Carbon|null $verified_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read User $user
 */
class UserEmail extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_emails';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'email',
        'type',
        'is_primary',
        'verified_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => EmailType::class,
            'is_primary' => 'boolean',
            'verified_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns the email.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to ensure only one primary email per user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeEnsureOnePrimaryPerUser($query, int $userId)
    {
        return $query->where('user_id', $userId)->where('is_primary', true);
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // When setting an email as primary, unset other primary emails for the same user
        static::saving(function ($email) {
            if ($email->is_primary && $email->user_id) {
                static::where('user_id', $email->user_id)
                    ->where('id', '!=', $email->id)
                    ->update(['is_primary' => false]);
            }
        });
    }
}