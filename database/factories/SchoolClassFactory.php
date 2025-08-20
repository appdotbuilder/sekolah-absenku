<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\SchoolClass>
     */
    protected $model = SchoolClass::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $grade = $this->faker->randomElement(['X', 'XI', 'XII']);
        $major = $this->faker->randomElement(['IPA', 'IPS', 'Bahasa']);
        $number = $this->faker->numberBetween(1, 3);
        
        return [
            'name' => $grade . '-' . $major . '-' . $number,
            'grade' => $grade,
            'major' => $major,
            'homeroom_teacher_id' => null, // Will be set in seeder
            'capacity' => $this->faker->numberBetween(25, 35),
        ];
    }
}