<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\SchoolClass;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Admin Sekolah',
            'email' => 'admin@sekolah.com',
            'password' => Hash::make('password'),
        ]);

        // Create classes
        $classes = [
            ['name' => 'X-IPA-1', 'grade' => 'X', 'major' => 'IPA'],
            ['name' => 'X-IPA-2', 'grade' => 'X', 'major' => 'IPA'],
            ['name' => 'X-IPS-1', 'grade' => 'X', 'major' => 'IPS'],
            ['name' => 'XI-IPA-1', 'grade' => 'XI', 'major' => 'IPA'],
            ['name' => 'XI-IPA-2', 'grade' => 'XI', 'major' => 'IPA'],
            ['name' => 'XI-IPS-1', 'grade' => 'XI', 'major' => 'IPS'],
            ['name' => 'XII-IPA-1', 'grade' => 'XII', 'major' => 'IPA'],
            ['name' => 'XII-IPS-1', 'grade' => 'XII', 'major' => 'IPS'],
        ];

        $createdClasses = [];
        foreach ($classes as $classData) {
            $createdClasses[] = SchoolClass::create([
                'name' => $classData['name'],
                'grade' => $classData['grade'],
                'major' => $classData['major'],
                'capacity' => random_int(25, 30),
            ]);
        }

        // Create teachers
        $teachers = [];
        for ($i = 1; $i <= 12; $i++) {
            $teachers[] = User::factory()->teacher()->create([
                'name' => 'Guru ' . $i,
                'email' => 'guru' . $i . '@sekolah.com',
                'password' => Hash::make('password'),
                'teacher_id' => str_pad((string)$i, 6, '0', STR_PAD_LEFT),
            ]);
        }

        // Assign homeroom teachers to classes
        foreach ($createdClasses as $index => $class) {
            if (isset($teachers[$index])) {
                $class->update(['homeroom_teacher_id' => $teachers[$index]->id]);
                $teachers[$index]->update(['class' => $class->name]);
            }
        }

        // Create students
        $students = [];
        foreach ($createdClasses as $class) {
            $studentsInClass = random_int(20, 25);
            for ($i = 1; $i <= $studentsInClass; $i++) {
                $students[] = User::factory()->student()->create([
                    'name' => 'Siswa ' . $class->name . '-' . str_pad((string)$i, 2, '0', STR_PAD_LEFT),
                    'email' => strtolower(str_replace('-', '', $class->name)) . 'siswa' . $i . '@sekolah.com',
                    'password' => Hash::make('password'),
                    'student_id' => str_pad((string)(count($students) + 1), 4, '0', STR_PAD_LEFT),
                    'class' => $class->name,
                ]);
            }
        }

        // Create some demo users
        User::factory()->student()->create([
            'name' => 'Demo Siswa',
            'email' => 'siswa@demo.com',
            'password' => Hash::make('password'),
            'student_id' => '9999',
            'class' => 'X-IPA-1',
        ]);

        User::factory()->teacher()->create([
            'name' => 'Demo Guru',
            'email' => 'guru@demo.com',
            'password' => Hash::make('password'),
            'teacher_id' => '999999',
            'class' => 'X-IPA-1',
        ]);

        // Create attendance records for the last 30 days
        $studentIds = User::where('role', 'siswa')->pluck('id')->toArray();
        $teacherIds = User::where('role', 'guru')->pluck('id')->toArray();

        for ($day = 0; $day < 30; $day++) {
            $date = Carbon::today()->subDays($day);
            
            // Skip weekends (assuming Saturday and Sunday are weekends)
            if ($date->isWeekend()) {
                continue;
            }

            foreach ($studentIds as $studentId) {
                // 85% chance of having attendance record
                if (random_int(1, 100) <= 85) {
                    $status = $this->getRandomAttendanceStatus();
                    
                    Attendance::create([
                        'user_id' => $studentId,
                        'date' => $date,
                        'status' => $status,
                        'check_in' => $status === 'hadir' ? $this->getRandomTime('07:30', '08:30') : null,
                        'check_out' => $status === 'hadir' && random_int(1, 100) <= 80 
                            ? $this->getRandomTime('14:30', '15:30') : null,
                        'notes' => $status !== 'hadir' ? $this->getRandomAbsentReason($status) : null,
                        'marked_by' => $status !== 'hadir' ? $teacherIds[array_rand($teacherIds)] : null,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);
                }
            }
        }
    }

    /**
     * Get random attendance status with realistic distribution.
     */
    protected function getRandomAttendanceStatus(): string
    {
        $rand = random_int(1, 100);
        
        if ($rand <= 80) return 'hadir';
        if ($rand <= 90) return 'izin';
        if ($rand <= 96) return 'sakit';
        return 'alpha';
    }

    /**
     * Get random time between two time ranges.
     */
    protected function getRandomTime(string $start, string $end): string
    {
        $startTime = strtotime($start);
        $endTime = strtotime($end);
        $randomTime = random_int($startTime, $endTime);
        
        return date('H:i:s', $randomTime);
    }

    /**
     * Get random absent reason based on status.
     */
    protected function getRandomAbsentReason(string $status): string
    {
        $reasons = [
            'izin' => [
                'Acara keluarga',
                'Keperluan penting',
                'Urusan keluarga',
                'Ada acara di rumah',
            ],
            'sakit' => [
                'Demam',
                'Flu',
                'Sakit perut',
                'Pusing',
                'Batuk pilek',
            ],
            'alpha' => [
                'Tidak ada keterangan',
                'Tidak hadir tanpa izin',
            ],
        ];

        $statusReasons = $reasons[$status] ?? ['Tidak ada keterangan'];
        return $statusReasons[array_rand($statusReasons)];
    }
}