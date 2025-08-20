import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Users, BarChart, Calendar, CheckCircle, X, Clock, FileText, BookOpen } from 'lucide-react';

interface TodayStats {
    total_students: number;
    present: number;
    absent: number;
    not_marked: number;
}

interface MonthlyStats {
    attendance_rate: number;
    total_records: number;
}

interface Props {
    todayStats: TodayStats;
    monthlyStats: MonthlyStats;
    classes: string[];
    assignedClass: string | null;
    [key: string]: unknown;
}

export default function TeacherDashboard({ 
    todayStats, 
    monthlyStats, 
    classes, 
    assignedClass
}: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; teacher_id: string } } }>().props;

    const attendanceRate = todayStats.total_students > 0 
        ? Math.round((todayStats.present / todayStats.total_students) * 100) 
        : 0;

    return (
        <AppShell>
            <Head title="Dashboard Guru" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👩‍🏫 Selamat datang, {auth.user.name}!
                    </h1>
                    <p className="text-lg text-gray-600">
                        {assignedClass ? `Wali Kelas ${assignedClass}` : 'Guru'} • NIP: {auth.user.teacher_id}
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <BookOpen className="w-6 h-6 mr-2" />
                        Aksi Cepat
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={route('attendance.index')}>
                            <Button className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 font-semibold">
                                📝 Kelola Absen Siswa
                            </Button>
                        </Link>
                        <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 font-semibold">
                            📊 Cetak Laporan
                        </Button>
                        <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 font-semibold">
                            📱 Bantuan
                        </Button>
                    </div>
                </div>

                {/* Today's Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Siswa</p>
                                <p className="text-3xl font-bold text-blue-600">{todayStats.total_students}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Hadir Hari Ini</p>
                                <p className="text-3xl font-bold text-green-600">{todayStats.present}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tidak Hadir</p>
                                <p className="text-3xl font-bold text-red-600">{todayStats.absent}</p>
                            </div>
                            <X className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Belum Ditandai</p>
                                <p className="text-3xl font-bold text-orange-600">{todayStats.not_marked}</p>
                            </div>
                            <Clock className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Today's Attendance Chart */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <BarChart className="w-6 h-6 mr-2 text-green-600" />
                            Kehadiran Hari Ini
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700">Tingkat Kehadiran</span>
                                <span className="font-bold text-2xl text-green-600">{attendanceRate}%</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${attendanceRate}%` }}
                                ></div>
                            </div>
                            
                            {/* Breakdown */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-green-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-2xl font-bold text-green-600">{todayStats.present}</span>
                                    </div>
                                    <p className="text-sm text-green-800 mt-1">Siswa Hadir</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <X className="w-5 h-5 text-red-600" />
                                        <span className="text-2xl font-bold text-red-600">{todayStats.absent}</span>
                                    </div>
                                    <p className="text-sm text-red-800 mt-1">Tidak Hadir</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                            Statistik Bulanan
                        </h2>
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600">{monthlyStats.attendance_rate}%</div>
                                <p className="text-sm text-gray-600">Rata-rata Kehadiran</p>
                            </div>
                            <div className="pt-4 border-t">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-700">{monthlyStats.total_records}</div>
                                    <p className="text-sm text-gray-600">Total Pencatatan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Class Management */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <Users className="w-6 h-6 mr-2 text-blue-600" />
                        Manajemen Kelas
                    </h2>
                    
                    {assignedClass ? (
                        <div className="bg-blue-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                🏛️ Kelas Yang Diampu: {assignedClass}
                            </h3>
                            <p className="text-blue-700 mb-4">
                                Anda adalah wali kelas untuk {assignedClass} dengan {todayStats.total_students} siswa.
                            </p>
                            <Link href={`${route('attendance.index')}?class=${assignedClass}`}>
                                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                    📋 Kelola Absensi Kelas
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                🎯 Akses Semua Kelas
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Sebagai guru, Anda dapat mengakses dan mengelola absensi untuk semua kelas.
                            </p>
                        </div>
                    )}
                    
                    {classes.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Kelas Tersedia:</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                {classes.map((className) => (
                                    <Link
                                        key={className}
                                        href={`${route('attendance.index')}?class=${className}`}
                                        className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-center transition-colors"
                                    >
                                        <div className="font-semibold text-gray-700">{className}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick Actions Card */}
                <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-green-600" />
                        Panduan Cepat
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">📝 Mengelola Absensi</h3>
                            <p className="text-sm text-gray-600">Tandai kehadiran siswa dengan mudah dan cepat.</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">📊 Melihat Laporan</h3>
                            <p className="text-sm text-gray-600">Akses laporan kehadiran dengan berbagai periode.</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">🎯 Tips Efektif</h3>
                            <p className="text-sm text-gray-600">Gunakan filter tanggal dan kelas untuk efisiensi.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}