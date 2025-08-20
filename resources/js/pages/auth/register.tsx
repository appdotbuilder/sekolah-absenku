import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, GraduationCap, Users, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    student_id: string;
    teacher_id: string;
    class: string;
    phone: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'siswa',
        student_id: '',
        teacher_id: '',
        class: '',
        phone: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const classes = [
        'X-IPA-1', 'X-IPA-2', 'X-IPS-1',
        'XI-IPA-1', 'XI-IPA-2', 'XI-IPS-1',
        'XII-IPA-1', 'XII-IPS-1'
    ];

    const roleIcons = {
        siswa: <GraduationCap className="w-4 h-4" />,
        guru: <Users className="w-4 h-4" />,
        admin: <Shield className="w-4 h-4" />
    };

    return (
        <AuthLayout title="Daftar Akun Sekolah" description="Daftarkan akun Anda untuk menggunakan sistem absensi">
            <Head title="Daftar" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Role Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="role" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Peran Pengguna
                        </Label>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih peran Anda" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="siswa">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-blue-600" />
                                        Siswa
                                    </div>
                                </SelectItem>
                                <SelectItem value="guru">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-green-600" />
                                        Guru
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-purple-600" />
                                        Admin Sekolah
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.role} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Nama lengkap sesuai identitas"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Student-specific fields */}
                    {data.role === 'siswa' && (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="student_id">NIS (Nomor Induk Siswa)</Label>
                                <Input
                                    id="student_id"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    value={data.student_id}
                                    onChange={(e) => setData('student_id', e.target.value)}
                                    disabled={processing}
                                    placeholder="Contoh: 1234"
                                />
                                <InputError message={errors.student_id} />
                            </div>
                            
                            <div className="grid gap-2">
                                <Label htmlFor="class">Kelas</Label>
                                <Select value={data.class} onValueChange={(value) => setData('class', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kelas Anda" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {classes.map((className) => (
                                            <SelectItem key={className} value={className}>
                                                {className}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.class} />
                            </div>
                        </>
                    )}

                    {/* Teacher-specific fields */}
                    {data.role === 'guru' && (
                        <div className="grid gap-2">
                            <Label htmlFor="teacher_id">NIP (Nomor Induk Pegawai)</Label>
                            <Input
                                id="teacher_id"
                                type="text"
                                required
                                tabIndex={3}
                                value={data.teacher_id}
                                onChange={(e) => setData('teacher_id', e.target.value)}
                                disabled={processing}
                                placeholder="Contoh: 123456"
                            />
                            <InputError message={errors.teacher_id} />
                        </div>
                    )}

                    <div className="grid gap-2">
                        <Label htmlFor="phone">No. Handphone (Opsional)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            tabIndex={4}
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            disabled={processing}
                            placeholder="08123456789"
                        />
                        <InputError message={errors.phone} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={5}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Minimal 8 karakter"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={6}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Ulangi password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={7} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        {roleIcons[data.role as keyof typeof roleIcons]}
                        <span className="ml-2">Daftar sebagai {data.role === 'siswa' ? 'Siswa' : data.role === 'guru' ? 'Guru' : 'Admin'}</span>
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Sudah punya akun?{' '}
                    <TextLink href={route('login')} tabIndex={8}>
                        Masuk di sini
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}