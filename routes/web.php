<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminAccess;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routes
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Attendance routes
    Route::controller(AttendanceController::class)->group(function () {
        Route::get('/attendance', 'index')->name('attendance.index');
        Route::post('/attendance', 'store')->name('attendance.store');
        Route::put('/attendance/check-out', 'update')->name('attendance.check-out');
    });
    
    // User management routes (Admin only)
    Route::middleware(AdminAccess::class)->group(function () {
        Route::resource('users', UserController::class);
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';