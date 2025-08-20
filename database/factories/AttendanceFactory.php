<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Attendance>
     */
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(['hadir', 'izin', 'sakit', 'alpha']);
        $date = $this->faker->dateTimeBetween('-30 days', 'now');
        
        return [
            'user_id' => User::factory(),
            'date' => $date->format('Y-m-d'),
            'status' => $status,
            'check_in' => $status === 'hadir' ? $this->faker->time('H:i:s', '09:00:00') : null,
            'check_out' => $status === 'hadir' && $this->faker->boolean(70) 
                ? $this->faker->time('H:i:s', '15:00:00') 
                : null,
            'notes' => $status !== 'hadir' ? $this->faker->optional()->sentence() : null,
            'marked_by' => $status !== 'hadir' ? User::factory()->state(['role' => 'guru']) : null,
            'created_at' => $date,
            'updated_at' => $date,
        ];
    }

    /**
     * State for present attendance.
     */
    public function present(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'hadir',
                'check_in' => $this->faker->time('H:i:s', '09:00:00'),
                'check_out' => $this->faker->boolean(80) 
                    ? $this->faker->time('H:i:s', '15:00:00') 
                    : null,
                'notes' => null,
            ];
        });
    }

    /**
     * State for absent attendance.
     */
    public function absent(): static
    {
        return $this->state(function (array $attributes) {
            $status = $this->faker->randomElement(['izin', 'sakit', 'alpha']);
            return [
                'status' => $status,
                'check_in' => null,
                'check_out' => null,
                'notes' => $this->faker->sentence(),
                'marked_by' => User::factory()->state(['role' => 'guru']),
            ];
        });
    }

    /**
     * State for today's attendance.
     */
    public function today(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'date' => Carbon::today()->format('Y-m-d'),
                'created_at' => Carbon::today(),
                'updated_at' => Carbon::today(),
            ];
        });
    }
}