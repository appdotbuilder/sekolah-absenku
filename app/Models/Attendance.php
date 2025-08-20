<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\Attendance
 *
 * @property int $id
 * @property int $user_id
 * @property string $date
 * @property string $status
 * @property string|null $check_in
 * @property string|null $check_out
 * @property string|null $notes
 * @property int|null $marked_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance query()
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereCheckIn($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereCheckOut($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereMarkedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Attendance whereUserId($value)
 * @method static \Database\Factories\AttendanceFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Attendance extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'date',
        'status',
        'check_in',
        'check_out',
        'notes',
        'marked_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'check_in' => 'datetime:H:i',
        'check_out' => 'datetime:H:i',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the attendance.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the teacher who marked the attendance.
     */
    public function markedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    /**
     * Scope a query to only include present attendances.
     */
    public function scopePresent($query)
    {
        return $query->where('status', 'hadir');
    }

    /**
     * Scope a query to only include absent attendances.
     */
    public function scopeAbsent($query)
    {
        return $query->whereIn('status', ['izin', 'sakit', 'alpha']);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Get the status badge color.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'hadir' => 'green',
            'izin' => 'yellow',
            'sakit' => 'blue',
            'alpha' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get the status label in Indonesian.
     */
    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'hadir' => 'Hadir',
            'izin' => 'Izin',
            'sakit' => 'Sakit',
            'alpha' => 'Alpha',
            default => 'Tidak Diketahui',
        };
    }
}