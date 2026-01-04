<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CategoryCost Model
 *
 * @property int $id
 * @property int $category_id
 * @property float $hourly_rate_pvp
 * @property float $hourly_rate_pc
 * @property float $overtime_rate_pvp
 * @property float $overtime_rate_pc
 * @property float $holiday_rate_pvp
 * @property float $holiday_rate_pc
 * @property float $daily_rate_pvp
 * @property float $daily_rate_pc
 * @property int $daily_minimum_hours
 * @property string $currency
 * @property \Illuminate\Support\Carbon $valid_from
 * @property \Illuminate\Support\Carbon|null $valid_to
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read Category $category
 */
class CategoryCost extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'category_costs';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'category_id',
        'hourly_rate_pvp',
        'hourly_rate_pc',
        'overtime_rate_pvp',
        'overtime_rate_pc',
        'holiday_rate_pvp',
        'holiday_rate_pc',
        'daily_rate_pvp',
        'daily_rate_pc',
        'daily_minimum_hours',
        'currency',
        'valid_from',
        'valid_to',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'hourly_rate_pvp' => 'decimal:2',
            'hourly_rate_pc' => 'decimal:2',
            'overtime_rate_pvp' => 'decimal:2',
            'overtime_rate_pc' => 'decimal:2',
            'holiday_rate_pvp' => 'decimal:2',
            'holiday_rate_pc' => 'decimal:2',
            'daily_rate_pvp' => 'decimal:2',
            'daily_rate_pc' => 'decimal:2',
            'daily_minimum_hours' => 'integer',
            'valid_from' => 'date',
            'valid_to' => 'date',
        ];
    }

    /**
     * Get the category that this cost information belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}