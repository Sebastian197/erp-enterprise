<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DashboardLayout extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'layout_config',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'layout_config' => 'array',
    ];

    /**
     * Get the user that owns the layout.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
