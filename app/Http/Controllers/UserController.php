<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['role', 'class', 'search']);
        
        $users = User::query()
            ->when($filters['role'] ?? null, function ($query, $role) {
                $query->where('role', $role);
            })
            ->when($filters['class'] ?? null, function ($query, $class) {
                $query->where('class', $class);
            })
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%')
                      ->orWhere('student_id', 'like', '%' . $search . '%')
                      ->orWhere('teacher_id', 'like', '%' . $search . '%');
                });
            })
            ->orderBy('name')
            ->paginate(15);
        
        // Get available classes for filter
        $classes = User::select('class')
            ->distinct()
            ->whereNotNull('class')
            ->orderBy('class')
            ->pluck('class');
        
        return Inertia::render('users/index', [
            'users' => $users,
            'classes' => $classes,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Get available classes
        $classes = User::select('class')
            ->distinct()
            ->whereNotNull('class')
            ->orderBy('class')
            ->pluck('class');
        
        return Inertia::render('users/create', [
            'classes' => $classes,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = Hash::make($data['password']);
        
        $user = User::create($data);
        
        return redirect()->route('users.show', $user)
            ->with('success', 'User berhasil ditambahkan!');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Load attendance statistics
        $attendanceStats = $user->attendances()
            ->selectRaw('
                status,
                COUNT(*) as count,
                DATE(MIN(date)) as first_date,
                DATE(MAX(date)) as last_date
            ')
            ->groupBy('status')
            ->get()
            ->keyBy('status');
        
        // Recent attendance (last 10 records)
        $recentAttendances = $user->attendances()
            ->with('markedBy:id,name')
            ->latest('date')
            ->limit(10)
            ->get();
        
        return Inertia::render('users/show', [
            'user' => $user,
            'attendanceStats' => $attendanceStats,
            'recentAttendances' => $recentAttendances,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Get available classes
        $classes = User::select('class')
            ->distinct()
            ->whereNotNull('class')
            ->orderBy('class')
            ->pluck('class');
        
        return Inertia::render('users/edit', [
            'user' => $user,
            'classes' => $classes,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        
        // Only hash password if it's being updated
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }
        
        $user->update($data);
        
        return redirect()->route('users.show', $user)
            ->with('success', 'User berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deletion of current user
        if ($user->id === auth()->id()) {
            return redirect()->back()
                ->with('error', 'Anda tidak dapat menghapus akun sendiri.');
        }
        
        $user->delete();
        
        return redirect()->route('users.index')
            ->with('success', 'User berhasil dihapus!');
    }


}