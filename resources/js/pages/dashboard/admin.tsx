import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { 
    Users, 
    BarChart, 
    Calendar, 
    CheckCircle, 
    X, 
    Clock, 
    FileText, 
    Settings,
    TrendingUp,
    UserPlus,
    Download,
    Shield
} from 'lucide-react';

interface TodayStats {
    total_students: number;
    present: number;
    absent: number;
    not_marked: number;
    attendance_rate: number;
}

interface MonthlyStats {
    total_records: number;
    attendance_rate: number;
    present: number;
    absent: number;
}

interface StatusBreakdown {
    hadir: number;
    izin: number;
    sakit: number;
    alpha: number;
}

interface ClassStat {
    class: string;
    student_count: number;
}

interface Props {
    totalStudents: number;
    totalTeachers: number;
    todayStats: TodayStats;
    monthlyStats: MonthlyStats;
    statusBreakdown: StatusBreakdown;
    classStats: ClassStat[];
    [key: string]: unknown;
}

export default function AdminDashboard({ 
    totalStudents,
    totalTeachers,
    todayStats, 
    monthlyStats, 
    statusBreakdown,
    classStats 
}: Props) {
    const { auth } = usePage<{ auth: { user: { name: string } } }>().props;

    return (
        <AppShell>
            <Head title="Dashboard Admin" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👨‍💼 Selamat datang, {auth.user.name}!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Administrator Sekolah • Dashboard Kontrol Penuh
                    </p>
                </div>

                {/* Quick Actions */}
                <div className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-6 text-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Shield className="w-6 h-6 mr-2" />
                        Panel Kontrol Admin
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={route('users.index')}>
                            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 font-semibold">
                                👥 Kelola Pengguna
                            </Button>
                        </Link>
                        <Link href={route('attendance.index')}>
                            <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 font-semibold">
                                📊 Lihat Semua Absensi
                            </Button>
                        </Link>
                        <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 font-semibold">
                            📄 Export Laporan
                        </Button>
                        <Button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 font-semibold">
                            ⚙️ Pengaturan Sistem
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Siswa</p>
                                <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Guru</p>
                                <p className="text-3xl font-bold text-green-600">{totalTeachers}</p>
                            </div>
                            <UserPlus className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Kehadiran Hari Ini</p>
                                <p className="text-3xl font-bold text-purple-600">{todayStats.attendance_rate}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pencatatan Bulan Ini</p>
                                <p className="text-3xl font-bold text-orange-600">{monthlyStats.total_records}</p>
                            </div>
                            <FileText className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Today's Attendance Overview */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                            Ringkasan Kehadiran Hari Ini
                        </h2>
                        
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-700">Tingkat Kehadiran Keseluruhan</span>
                                <span className="font-bold text-2xl text-blue-600">{todayStats.attendance_rate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
                                    style={{ width: `${todayStats.attendance_rate}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-green-600">{todayStats.present}</div>
                                <div className="text-sm text-green-800">Hadir</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4 text-center">
                                <X className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-red-600">{todayStats.absent}</div>
                                <div className="text-sm text-red-800">Tidak Hadir</div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4 text-center">
                                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-orange-600">{todayStats.not_marked}</div>
                                <div className="text-sm text-orange-800">Belum Ditandai</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-blue-600">{todayStats.total_students}</div>
                                <div className="text-sm text-blue-800">Total Siswa</div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <BarChart className="w-6 h-6 mr-2 text-green-600" />
                            Statistik Bulanan
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{monthlyStats.attendance_rate}%</div>
                                <p className="text-sm text-gray-600">Rata-rata Kehadiran</p>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Hadir</span>
                                    <span className="font-semibold text-green-600">{monthlyStats.present}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Tidak Hadir</span>
                                    <span className="font-semibold text-red-600">{monthlyStats.absent}</span>
                                </div>
                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="text-sm font-medium">Total Pencatatan</span>
                                    <span className="font-bold text-gray-900">{monthlyStats.total_records}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Status Breakdown */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                            Breakdown Status (Bulan Ini)
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                                    <span className="font-medium text-green-800">Hadir</span>
                                </div>
                                <span className="font-bold text-green-600">{statusBreakdown.hadir}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 text-yellow-600 mr-3" />
                                    <span className="font-medium text-yellow-800">Izin</span>
                                </div>
                                <span className="font-bold text-yellow-600">{statusBreakdown.izin}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center">
                                    <Settings className="w-5 h-5 text-blue-600 mr-3" />
                                    <span className="font-medium text-blue-800">Sakit</span>
                                </div>
                                <span className="font-bold text-blue-600">{statusBreakdown.sakit}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div className="flex items-center">
                                    <X className="w-5 h-5 text-red-600 mr-3" />
                                    <span className="font-medium text-red-800">Alpha</span>
                                </div>
                                <span className="font-bold text-red-600">{statusBreakdown.alpha}</span>
                            </div>
                        </div>
                    </div>

                    {/* Class Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Users className="w-6 h-6 mr-2 text-orange-600" />
                            Statistik Per Kelas
                        </h2>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {classStats.map((classStat) => (
                                <div key={classStat.class} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <span className="font-medium text-gray-800">Kelas {classStat.class}</span>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">{classStat.student_count} siswa</span>
                                        <Link
                                            href={`${route('attendance.index')}?class=${classStat.class}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                        >
                                            Lihat →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-blue-600" />
                        Aksi Administrator
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href={route('users.create')}>
                            <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                                <UserPlus className="w-8 h-8 text-green-600 mb-2" />
                                <h3 className="font-semibold text-gray-800 mb-1">Tambah Pengguna</h3>
                                <p className="text-sm text-gray-600">Daftarkan siswa atau guru baru</p>
                            </div>
                        </Link>
                        <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <Download className="w-8 h-8 text-blue-600 mb-2" />
                            <h3 className="font-semibold text-gray-800 mb-1">Export Data</h3>
                            <p className="text-sm text-gray-600">Unduh laporan dalam format PDF/Excel</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <BarChart className="w-8 h-8 text-purple-600 mb-2" />
                            <h3 className="font-semibold text-gray-800 mb-1">Analisis Data</h3>
                            <p className="text-sm text-gray-600">Lihat tren dan pola kehadiran</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <Settings className="w-8 h-8 text-gray-600 mb-2" />
                            <h3 className="font-semibold text-gray-800 mb-1">Pengaturan</h3>
                            <p className="text-sm text-gray-600">Konfigurasi sistem aplikasi</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}