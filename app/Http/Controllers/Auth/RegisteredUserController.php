<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:siswa,guru,admin',
            'student_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::requiredIf($request->role === 'siswa'),
                'unique:users,student_id',
            ],
            'teacher_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::requiredIf($request->role === 'guru'),
                'unique:users,teacher_id',
            ],
            'class' => [
                'nullable',
                'string',
                'max:20',
                Rule::requiredIf($request->role === 'siswa'),
            ],
            'phone' => 'nullable|string|max:20',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.required' => 'Role pengguna wajib dipilih.',
            'role.in' => 'Role tidak valid.',
            'student_id.required' => 'NIS wajib diisi untuk siswa.',
            'student_id.unique' => 'NIS sudah terdaftar.',
            'teacher_id.required' => 'NIP wajib diisi untuk guru.',
            'teacher_id.unique' => 'NIP sudah terdaftar.',
            'class.required' => 'Kelas wajib diisi untuk siswa.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'student_id' => $request->student_id,
            'teacher_id' => $request->teacher_id,
            'class' => $request->class,
            'phone' => $request->phone,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('dashboard', absolute: false));
    }
}