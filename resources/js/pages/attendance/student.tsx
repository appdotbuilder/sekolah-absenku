import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, X, AlertCircle, TrendingUp, CalendarDays } from 'lucide-react';

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
    attendances: Attendance[];
    stats: Stats;
    today: string;
    [key: string]: unknown;
}

export default function StudentAttendance({ 
    todayAttendance, 
    attendances, 
    stats, 
    today 
}: Props) {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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
            case 'hadir': return 'text-green-600 bg-green-100 border-green-200';
            case 'izin': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            case 'sakit': return 'text-blue-600 bg-blue-100 border-blue-200';
            case 'alpha': return 'text-red-600 bg-red-100 border-red-200';
            default: return 'text-gray-600 bg-gray-100 border-gray-200';
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

    // Generate calendar days
    const generateCalendarDays = () => {
        const firstDay = new Date(selectedYear, selectedMonth, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const currentDate = new Date(startDate);
        
        for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
            const dateStr = currentDate.toISOString().split('T')[0];
            const attendance = attendances.find(a => a.date === dateStr);
            
            days.push({
                date: new Date(currentDate),
                dateStr,
                attendance,
                isCurrentMonth: currentDate.getMonth() === selectedMonth,
                isToday: dateStr === today
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return days;
    };

    const calendarDays = generateCalendarDays();
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const canCheckIn = !todayAttendance || !todayAttendance.check_in;
    const canCheckOut = todayAttendance && todayAttendance.check_in && !todayAttendance.check_out;

    return (
        <AppShell>
            <Head title="Absensi Siswa" />
            
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        📖 Absensi Kehadiran
                    </h1>
                    <p className="text-lg text-gray-600">
                        Kelola absensi masuk dan pulang Anda
                    </p>
                </div>

                {/* Check In/Out Section */}
                <div className="mb-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white">
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <Clock className="w-6 h-6 mr-2" />
                        Absen Hari Ini - {new Date(today).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">🏫 Absen Masuk</h3>
                            {todayAttendance && todayAttendance.check_in ? (
                                <div className="text-green-100">
                                    ✅ Sudah absen masuk pada {todayAttendance.check_in}
                                </div>
                            ) : (
                                <div>
                                    {canCheckIn ? (
                                        <Button
                                            onClick={handleCheckIn}
                                            className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 font-semibold"
                                        >
                                            ✅ Absen Masuk
                                        </Button>
                                    ) : (
                                        <div className="text-yellow-100">⏰ Menunggu absen masuk</div>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">🏠 Absen Pulang</h3>
                            {todayAttendance && todayAttendance.check_out ? (
                                <div className="text-green-100">
                                    ✅ Sudah absen pulang pada {todayAttendance.check_out}
                                </div>
                            ) : (
                                <div>
                                    {canCheckOut ? (
                                        <Button
                                            onClick={handleCheckOut}
                                            className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 font-semibold"
                                        >
                                            🏠 Absen Pulang
                                        </Button>
                                    ) : (
                                        <div className="text-yellow-100">
                                            {todayAttendance?.check_in ? '⏰ Silakan absen pulang nanti' : '⚠️ Absen masuk dulu'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Statistics */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                            Statistik Bulan Ini
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-600">{stats.total_days}</div>
                                <div className="text-sm text-blue-800">Total Hari Tercatat</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-600">{stats.present_days}</div>
                                <div className="text-sm text-green-800">Hari Hadir</div>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-red-600">{stats.absent_days}</div>
                                <div className="text-sm text-red-800">Hari Tidak Hadir</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-purple-600">{stats.attendance_rate}%</div>
                                <div className="text-sm text-purple-800">Tingkat Kehadiran</div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar View */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                                Kalender Kehadiran
                            </h2>
                            <div className="flex items-center space-x-2">
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                >
                                    {monthNames.map((month, index) => (
                                        <option key={index} value={index}>{month}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="border rounded-lg px-3 py-2 text-sm"
                                >
                                    {[2023, 2024, 2025].map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* Calendar Header */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                                <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
                                    {day}
                                </div>
                            ))}
                        </div>
                        
                        {/* Calendar Body */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`
                                        p-2 text-center text-sm rounded-lg relative
                                        ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                                        ${day.isToday ? 'bg-blue-100 border-2 border-blue-300' : ''}
                                        ${day.attendance ? getStatusColor(day.attendance.status) : ''}
                                    `}
                                >
                                    <div className="font-medium">{day.date.getDate()}</div>
                                    {day.attendance && day.isCurrentMonth && (
                                        <div className="absolute -top-1 -right-1">
                                            {getStatusIcon(day.attendance.status)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Legend */}
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                                    <span>Hadir</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 text-yellow-600 mr-1" />
                                    <span>Izin</span>
                                </div>
                                <div className="flex items-center">
                                    <AlertCircle className="w-4 h-4 text-blue-600 mr-1" />
                                    <span>Sakit</span>
                                </div>
                                <div className="flex items-center">
                                    <X className="w-4 h-4 text-red-600 mr-1" />
                                    <span>Alpha</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Attendance List */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <CalendarDays className="w-6 h-6 mr-2 text-green-600" />
                        Riwayat Kehadiran Terbaru
                    </h2>
                    {attendances.length > 0 ? (
                        <div className="space-y-3">
                            {attendances.slice(0, 10).map((attendance) => (
                                <div
                                    key={attendance.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-3 rounded-full ${getStatusColor(attendance.status)}`}>
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
                                            <p className={`text-sm font-medium ${getStatusColor(attendance.status).split(' ')[0]}`}>
                                                {getStatusLabel(attendance.status)}
                                            </p>
                                            {attendance.notes && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Catatan: {attendance.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-600">
                                        {attendance.check_in && (
                                            <p className="flex items-center">
                                                <span className="text-green-600 mr-1">🏫</span>
                                                {attendance.check_in}
                                            </p>
                                        )}
                                        {attendance.check_out && (
                                            <p className="flex items-center mt-1">
                                                <span className="text-blue-600 mr-1">🏠</span>
                                                {attendance.check_out}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium mb-2">Belum Ada Riwayat Kehadiran</h3>
                            <p>Mulai absen hari ini untuk melihat riwayat kehadiran Anda</p>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}