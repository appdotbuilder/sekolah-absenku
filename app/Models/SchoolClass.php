<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\SchoolClass
 *
 * @property int $id
 * @property string $name
 * @property string $grade
 * @property string|null $major
 * @property int|null $homeroom_teacher_id
 * @property int $capacity
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass query()
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereCapacity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereGrade($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereHomeroomTeacherId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereMajor($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|SchoolClass whereUpdatedAt($value)
 * @method static \Database\Factories\SchoolClassFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class SchoolClass extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'classes';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'grade',
        'major',
        'homeroom_teacher_id',
        'capacity',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the homeroom teacher for the class.
     */
    public function homeroomTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'homeroom_teacher_id');
    }

    /**
     * Get the students in this class.
     */
    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'class', 'name')->where('role', 'siswa');
    }

    /**
     * Scope a query to filter by grade.
     */
    public function scopeByGrade($query, $grade)
    {
        return $query->where('grade', $grade);
    }

    /**
     * Get the full class name with grade and major.
     */
    public function getFullNameAttribute(): string
    {
        $name = $this->grade;
        if ($this->major) {
            $name .= ' ' . $this->major;
        }
        if ($this->name !== $name) {
            $name .= ' (' . $this->name . ')';
        }
        return $name;
    }
}