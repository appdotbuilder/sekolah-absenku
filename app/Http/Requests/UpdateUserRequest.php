<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdmin() || auth()->id() === $this->route('user')->id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $user = $this->route('user');
        
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => [
                'required',
                'in:siswa,guru,admin',
                Rule::when(!auth()->user()->isAdmin(), function () {
                    return 'in:' . $this->route('user')->role; // Non-admin can't change role
                }),
            ],
            'student_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::requiredIf($this->role === 'siswa'),
                Rule::unique('users', 'student_id')->ignore($user->id),
            ],
            'teacher_id' => [
                'nullable',
                'string',
                'max:50',
                Rule::requiredIf($this->role === 'guru'),
                Rule::unique('users', 'teacher_id')->ignore($user->id),
            ],
            'class' => [
                'nullable',
                'string',
                'max:20',
                Rule::requiredIf($this->role === 'siswa'),
            ],
            'phone' => 'nullable|string|max:20',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'role.required' => 'Role pengguna wajib dipilih.',
            'role.in' => 'Role tidak valid.',
            'student_id.required' => 'NIS wajib diisi untuk siswa.',
            'student_id.unique' => 'NIS sudah terdaftar.',
            'teacher_id.required' => 'NIP wajib diisi untuk guru.',
            'teacher_id.unique' => 'NIP sudah terdaftar.',
            'class.required' => 'Kelas wajib diisi untuk siswa.',
        ];
    }
}