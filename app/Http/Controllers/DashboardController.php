<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display the dashboard based on user role.
     */
    public function index()
    {
        $user = Auth::user();
        
        if ($user->isStudent()) {
            return $this->renderStudentDashboard();
        } elseif ($user->isTeacher()) {
            return $this->renderTeacherDashboard();
        } elseif ($user->isAdmin()) {
            return $this->renderAdminDashboard();
        }
        
        return Inertia::render('dashboard');
    }

    /**
     * Render student dashboard view.
     */
    protected function renderStudentDashboard()
    {
        $user = Auth::user();
        $today = Carbon::today();
        
        // Get today's attendance
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();
        
        // Get this month's statistics
        $thisMonth = Attendance::where('user_id', $user->id)
            ->where('date', '>=', $today->copy()->startOfMonth())
            ->get();
        
        $stats = [
            'total_days' => $thisMonth->count(),
            'present_days' => $thisMonth->where('status', 'hadir')->count(),
            'absent_days' => $thisMonth->whereIn('status', ['izin', 'sakit', 'alpha'])->count(),
            'attendance_rate' => $thisMonth->count() > 0 
                ? round(($thisMonth->where('status', 'hadir')->count() / $thisMonth->count()) * 100, 1)
                : 0
        ];
        
        // Get recent attendance (last 7 days)
        $recentAttendances = Attendance::where('user_id', $user->id)
            ->where('date', '>=', $today->copy()->subDays(7))
            ->orderBy('date', 'desc')
            ->get();
        
        return Inertia::render('dashboard/student', [
            'todayAttendance' => $todayAttendance,
            'stats' => $stats,
            'recentAttendances' => $recentAttendances,
            'today' => $today->format('Y-m-d'),
            'canCheckIn' => !$todayAttendance || !$todayAttendance->check_in,
            'canCheckOut' => $todayAttendance && $todayAttendance->check_in && !$todayAttendance->check_out,
        ]);
    }

    /**
     * Render teacher dashboard view.
     */
    protected function renderTeacherDashboard()
    {
        $user = Auth::user();
        $today = Carbon::today();
        
        // Get students from teacher's classes or all students if no specific class assigned
        $students = User::students();
        if ($user->class) {
            $students = $students->where('class', $user->class);
        }
        $studentIds = $students->pluck('id');
        
        // Today's attendance summary
        $todayAttendances = Attendance::whereIn('user_id', $studentIds)
            ->where('date', $today)
            ->get();
        
        $todayStats = [
            'total_students' => $students->count(),
            'present' => $todayAttendances->where('status', 'hadir')->count(),
            'absent' => $todayAttendances->whereIn('status', ['izin', 'sakit', 'alpha'])->count(),
            'not_marked' => $students->count() - $todayAttendances->count(),
        ];
        
        // This month's statistics
        $thisMonthAttendances = Attendance::whereIn('user_id', $studentIds)
            ->where('date', '>=', $today->copy()->startOfMonth())
            ->get();
        
        $monthlyStats = [
            'attendance_rate' => $thisMonthAttendances->count() > 0
                ? round(($thisMonthAttendances->where('status', 'hadir')->count() / $thisMonthAttendances->count()) * 100, 1)
                : 0,
            'total_records' => $thisMonthAttendances->count(),
        ];
        
        // Get available classes
        $classes = User::students()
            ->select('class')
            ->distinct()
            ->whereNotNull('class')
            ->orderBy('class')
            ->pluck('class');
        
        return Inertia::render('dashboard/teacher', [
            'todayStats' => $todayStats,
            'monthlyStats' => $monthlyStats,
            'classes' => $classes,
            'assignedClass' => $user->class,
            'today' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Render admin dashboard view.
     */
    protected function renderAdminDashboard()
    {
        $today = Carbon::today();
        
        // Overall statistics
        $totalStudents = User::students()->count();
        $totalTeachers = User::teachers()->count();
        
        // Today's attendance
        $todayAttendances = Attendance::where('date', $today)->get();
        $todayStats = [
            'total_students' => $totalStudents,
            'present' => $todayAttendances->where('status', 'hadir')->count(),
            'absent' => $todayAttendances->whereIn('status', ['izin', 'sakit', 'alpha'])->count(),
            'not_marked' => $totalStudents - $todayAttendances->count(),
            'attendance_rate' => $todayAttendances->count() > 0
                ? round(($todayAttendances->where('status', 'hadir')->count() / $todayAttendances->count()) * 100, 1)
                : 0,
        ];
        
        // This month's statistics
        $thisMonthAttendances = Attendance::where('date', '>=', $today->copy()->startOfMonth())->get();
        $monthlyStats = [
            'total_records' => $thisMonthAttendances->count(),
            'attendance_rate' => $thisMonthAttendances->count() > 0
                ? round(($thisMonthAttendances->where('status', 'hadir')->count() / $thisMonthAttendances->count()) * 100, 1)
                : 0,
            'present' => $thisMonthAttendances->where('status', 'hadir')->count(),
            'absent' => $thisMonthAttendances->whereIn('status', ['izin', 'sakit', 'alpha'])->count(),
        ];
        
        // Attendance by status (this month)
        $statusBreakdown = [
            'hadir' => $thisMonthAttendances->where('status', 'hadir')->count(),
            'izin' => $thisMonthAttendances->where('status', 'izin')->count(),
            'sakit' => $thisMonthAttendances->where('status', 'sakit')->count(),
            'alpha' => $thisMonthAttendances->where('status', 'alpha')->count(),
        ];
        
        // Get class statistics
        $classStats = User::students()
            ->select('class')
            ->selectRaw('COUNT(*) as student_count')
            ->whereNotNull('class')
            ->groupBy('class')
            ->orderBy('class')
            ->get();
        
        return Inertia::render('dashboard/admin', [
            'totalStudents' => $totalStudents,
            'totalTeachers' => $totalTeachers,
            'todayStats' => $todayStats,
            'monthlyStats' => $monthlyStats,
            'statusBreakdown' => $statusBreakdown,
            'classStats' => $classStats,
            'today' => $today->format('Y-m-d'),
        ]);
    }
}