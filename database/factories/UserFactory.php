<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'siswa',
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * State for student users.
     */
    public function student(): static
    {
        return $this->state(function (array $attributes) {
            $classes = ['X-IPA-1', 'X-IPA-2', 'X-IPS-1', 'XI-IPA-1', 'XI-IPA-2', 'XI-IPS-1', 'XII-IPA-1', 'XII-IPS-1'];
            
            return [
                'role' => 'siswa',
                'student_id' => $this->faker->unique()->numerify('####'),
                'class' => $this->faker->randomElement($classes),
                'phone' => $this->faker->optional()->phoneNumber(),
            ];
        });
    }

    /**
     * State for teacher users.
     */
    public function teacher(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'guru',
                'teacher_id' => $this->faker->unique()->numerify('######'),
                'class' => null, // Will be assigned by seeder if homeroom teacher
                'phone' => $this->faker->optional()->phoneNumber(),
            ];
        });
    }

    /**
     * State for admin users.
     */
    public function admin(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'admin',
                'student_id' => null,
                'teacher_id' => null,
                'class' => null,
                'phone' => $this->faker->optional()->phoneNumber(),
            ];
        });
    }
}