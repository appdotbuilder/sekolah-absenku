<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user->isStudent()) {
            return $this->handleStudentIndex($request);
        } elseif ($user->isTeacher()) {
            return $this->handleTeacherIndex($request);
        } elseif ($user->isAdmin()) {
            return $this->handleAdminIndex($request);
        }
        
        return redirect()->route('dashboard');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        
        if ($user->isStudent()) {
            return $this->handleStudentCheckIn($request);
        } elseif ($user->isTeacher()) {
            return $this->handleTeacherMarkAttendance($request);
        }
        
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user->isStudent()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $today = Carbon::today();
        $now = Carbon::now();
        
        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();
        
        if (!$attendance) {
            return redirect()->back()->with('error', 'Anda belum absen masuk hari ini.');
        }
        
        if ($attendance->check_out) {
            return redirect()->back()->with('error', 'Anda sudah absen pulang hari ini.');
        }
        
        $attendance->update([
            'check_out' => $now->format('H:i:s'),
        ]);
        
        return redirect()->back()->with('success', 'Absen pulang berhasil dicatat!');
    }

    /**
     * Handle student attendance view.
     */
    protected function handleStudentIndex(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::today();
        
        // Get today's attendance
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();
        
        // Get recent attendance history (last 30 days)
        $attendances = Attendance::where('user_id', $user->id)
            ->where('date', '>=', $today->copy()->subDays(30))
            ->orderBy('date', 'desc')
            ->get();
        
        // Calculate statistics
        $thisMonthAttendances = Attendance::where('user_id', $user->id)
            ->where('date', '>=', $today->copy()->startOfMonth())
            ->get();
        
        $stats = [
            'total_days' => $thisMonthAttendances->count(),
            'present_days' => $thisMonthAttendances->where('status', 'hadir')->count(),
            'absent_days' => $thisMonthAttendances->whereIn('status', ['izin', 'sakit', 'alpha'])->count(),
            'attendance_rate' => $thisMonthAttendances->count() > 0 
                ? round(($thisMonthAttendances->where('status', 'hadir')->count() / $thisMonthAttendances->count()) * 100, 1)
                : 0
        ];
        
        return Inertia::render('attendance/student', [
            'todayAttendance' => $todayAttendance,
            'attendances' => $attendances,
            'stats' => $stats,
            'today' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Handle teacher attendance view.
     */
    protected function handleTeacherIndex(Request $request)
    {
        $class = $request->get('class', null);
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));
        
        // Get students by class
        $students = User::students();
        
        if ($class) {
            $students = $students->where('class', $class);
        }
        
        $students = $students->orderBy('name')->get();
        
        // Get attendances for the selected date
        $attendances = Attendance::where('date', $date)
            ->whereIn('user_id', $students->pluck('id'))
            ->get()
            ->keyBy('user_id');
        
        // Get available classes
        $classes = User::students()
            ->select('class')
            ->distinct()
            ->whereNotNull('class')
            ->orderBy('class')
            ->pluck('class');
        
        return Inertia::render('attendance/teacher', [
            'students' => $students,
            'attendances' => $attendances,
            'classes' => $classes,
            'selectedClass' => $class,
            'selectedDate' => $date,
        ]);
    }

    /**
     * Handle admin attendance view.
     */
    protected function handleAdminIndex(Request $request)
    {
        $filters = $request->only(['class', 'date_from', 'date_to', 'status']);
        
        $attendances = Attendance::with(['user', 'markedBy'])
            ->when($filters['class'] ?? null, function ($query, $class) {
                $query->whereHas('user', function ($q) use ($class) {
                    $q->where('class', $class);
                });
            })
            ->when($filters['date_from'] ?? null, function ($query, $dateFrom) {
                $query->where('date', '>=', $dateFrom);
            })
            ->when($filters['date_to'] ?? null, function ($query, $dateTo) {
                $query->where('date', '<=', $dateTo);
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                $query->where('status', $status);
            })
            ->orderBy('date', 'desc')
            ->paginate(20);
        
        // Get statistics
        $stats = [
            'total_students' => User::students()->count(),
            'present_today' => Attendance::where('date', Carbon::today())
                ->where('status', 'hadir')
                ->count(),
            'absent_today' => Attendance::where('date', Carbon::today())
                ->whereIn('status', ['izin', 'sakit', 'alpha'])
                ->count(),
            'attendance_rate' => $this->calculateOverallAttendanceRate(),
        ];
        
        // Get available classes
        $classes = User::students()
            ->select('class')
            ->distinct()
            ->whereNotNull('class')
            ->orderBy('class')
            ->pluck('class');
        
        return Inertia::render('attendance/admin', [
            'attendances' => $attendances,
            'stats' => $stats,
            'classes' => $classes,
            'filters' => $filters,
        ]);
    }

    /**
     * Handle student check-in functionality.
     */
    protected function handleStudentCheckIn(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::today();
        $now = Carbon::now();
        
        $attendance = Attendance::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $today,
            ],
            [
                'status' => 'hadir',
                'check_in' => $now->format('H:i:s'),
            ]
        );
        
        if (!$attendance->wasRecentlyCreated && !$attendance->check_in) {
            $attendance->update([
                'status' => 'hadir',
                'check_in' => $now->format('H:i:s'),
            ]);
        }
        
        return redirect()->back()->with('success', 'Absen masuk berhasil dicatat!');
    }

    /**
     * Handle teacher mark attendance functionality.
     */
    protected function handleTeacherMarkAttendance(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'status' => 'required|in:hadir,izin,sakit,alpha',
            'notes' => 'nullable|string|max:500',
        ]);
        
        $attendance = Attendance::updateOrCreate(
            [
                'user_id' => $request->user_id,
                'date' => $request->date,
            ],
            [
                'status' => $request->status,
                'notes' => $request->notes,
                'marked_by' => Auth::id(),
            ]
        );
        
        return redirect()->back()->with('success', 'Status kehadiran berhasil diperbarui!');
    }

    /**
     * Calculate overall attendance rate.
     */
    protected function calculateOverallAttendanceRate()
    {
        $totalAttendances = Attendance::count();
        
        if ($totalAttendances === 0) {
            return 0;
        }
        
        $presentAttendances = Attendance::where('status', 'hadir')->count();
        
        return round(($presentAttendances / $totalAttendances) * 100, 1);
    }
}