import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, X, AlertCircle, User, TrendingUp } from 'lucide-react';

interface Attendance {
    id: number;
    date: string;
    status: 'hadir' | 'izin' | 'sakit' | 'alpha';
    check_in: string | null;
    check_out: string | null;
    notes: string | null;
    [key: string]: unknown;
}

interface Stats {
    total_days: number;
    present_days: number;
    absent_days: number;
    attendance_rate: number;
}

interface Props {
    todayAttendance: Attendance | null;
    stats: Stats;
    recentAttendances: Attendance[];
    canCheckIn: boolean;
    canCheckOut: boolean;
    [key: string]: unknown;
}

export default function StudentDashboard({ 
    todayAttendance, 
    stats, 
    recentAttendances, 
    canCheckIn,
    canCheckOut 
}: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; class: string; student_id: string; phone?: string } } }>().props;

    const handleCheckIn = () => {
        router.post(route('attendance.store'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleCheckOut = () => {
        router.put(route('attendance.check-out'), {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'hadir': return 'text-green-600 bg-green-100';
            case 'izin': return 'text-yellow-600 bg-yellow-100';
            case 'sakit': return 'text-blue-600 bg-blue-100';
            case 'alpha': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'hadir': return <CheckCircle className="w-4 h-4" />;
            case 'izin': return <Clock className="w-4 h-4" />;
            case 'sakit': return <AlertCircle className="w-4 h-4" />;
            case 'alpha': return <X className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'hadir': return 'Hadir';
            case 'izin': return 'Izin';
            case 'sakit': return 'Sakit';
            case 'alpha': return 'Alpha';
            default: return 'Tidak Diketahui';
        }
    };

    return (
        <AppShell>
            <Head title="Dashboard Siswa" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📚 Selamat datang, {auth.user.name}!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Kelas {auth.user.class} • NIS: {auth.user.student_id}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Clock className="w-6 h-6 mr-2" />
                        Absen Hari Ini
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        {canCheckIn && (
                            <Button
                                onClick={handleCheckIn}
                                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 font-semibold text-lg"
                            >
                                ✅ Absen Masuk
                            </Button>
                        )}
                        
                        {canCheckOut && (
                            <Button
                                onClick={handleCheckOut}
                                className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 font-semibold text-lg"
                            >
                                🏠 Absen Pulang
                            </Button>
                        )}

                        {todayAttendance && todayAttendance.check_in && todayAttendance.check_out && (
                            <div className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-lg">
                                ✨ Absensi Hari Ini Selesai
                            </div>
                        )}
                    </div>

                    {todayAttendance && (
                        <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Status: {getStatusLabel(todayAttendance.status)}</p>
                                    {todayAttendance.check_in && (
                                        <p className="text-sm opacity-90">Masuk: {todayAttendance.check_in}</p>
                                    )}
                                    {todayAttendance.check_out && (
                                        <p className="text-sm opacity-90">Pulang: {todayAttendance.check_out}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Statistics */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                            Statistik Bulan Ini
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.total_days}</div>
                                <div className="text-sm text-blue-800">Total Hari</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.present_days}</div>
                                <div className="text-sm text-green-800">Hadir</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-red-600">{stats.absent_days}</div>
                                <div className="text-sm text-red-800">Tidak Hadir</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">{stats.attendance_rate}%</div>
                                <div className="text-sm text-purple-800">Persentase</div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Info */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <User className="w-6 h-6 mr-2 text-green-600" />
                            Info Siswa
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600">Nama Lengkap</p>
                                <p className="font-medium">{auth.user.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Kelas</p>
                                <p className="font-medium">{auth.user.class}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">NIS</p>
                                <p className="font-medium">{auth.user.student_id}</p>
                            </div>
                            {auth.user.phone && (
                                <div>
                                    <p className="text-sm text-gray-600">No. HP</p>
                                    <p className="font-medium">{auth.user.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                        Riwayat Kehadiran (7 Hari Terakhir)
                    </h2>
                    {recentAttendances.length > 0 ? (
                        <div className="space-y-3">
                            {recentAttendances.map((attendance) => (
                                <div
                                    key={attendance.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${getStatusColor(attendance.status)}`}>
                                            {getStatusIcon(attendance.status)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {new Date(attendance.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Status: {getStatusLabel(attendance.status)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        {attendance.check_in && (
                                            <p>Masuk: {attendance.check_in}</p>
                                        )}
                                        {attendance.check_out && (
                                            <p>Pulang: {attendance.check_out}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p>Belum ada riwayat kehadiran</p>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}