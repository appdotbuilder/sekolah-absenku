import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, Users, BarChart, Clock, CheckCircle, UserCheck, FileText, Video, Settings } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            title: "Absen Digital",
            description: "Sistem absen masuk dan pulang yang mudah dengan satu klik"
        },
        {
            icon: <Calendar className="w-6 h-6 text-blue-600" />,
            title: "Kalender Kehadiran",
            description: "Lihat riwayat kehadiran dalam tampilan kalender yang jelas"
        },
        {
            icon: <Users className="w-6 h-6 text-purple-600" />,
            title: "Manajemen Kelas",
            description: "Kelola kehadiran siswa per kelas dengan mudah"
        },
        {
            icon: <BarChart className="w-6 h-6 text-orange-600" />,
            title: "Laporan Lengkap",
            description: "Export laporan kehadiran ke PDF/Excel dengan berbagai periode"
        }
    ];

    const roles = [
        {
            title: "👨‍🎓 Siswa",
            features: ["Absen masuk & pulang", "Kalender kehadiran", "Riwayat absensi", "Status kehadiran"]
        },
        {
            title: "👩‍🏫 Guru",
            features: ["Kelola absen kelas", "Ubah status siswa", "Cetak rekap kehadiran", "Monitor kehadiran"]
        },
        {
            title: "👨‍💼 Admin Sekolah",
            features: ["Dashboard statistik", "Kelola user", "Export laporan", "Data kehadiran lengkap"]
        }
    ];

    return (
        <>
            <Head title="Sekolah Absenku - Aplikasi Absensi Digital Sekolah">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
                {/* Navigation */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center py-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-500 rounded-xl flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">Sekolah Absenku</h1>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Clock className="w-4 h-4 mr-2" />
                            Sistem Absensi Digital Modern
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            📚 <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Sekolah Absenku</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Aplikasi absensi digital yang mudah digunakan untuk siswa, guru, dan admin sekolah. 
                            Kelola kehadiran dengan efisien dan dapatkan laporan yang akurat.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {!auth.user && (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg inline-flex items-center"
                                    >
                                        Mulai Sekarang
                                        <CheckCircle className="w-5 h-5 ml-2" />
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg"
                                    >
                                        Masuk ke Akun
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">✨ Fitur Unggulan</h2>
                            <p className="text-lg text-gray-600">Semua yang Anda butuhkan untuk mengelola kehadiran sekolah</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                                    <div className="mb-4">{feature.icon}</div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Roles Section */}
                <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">🎯 Untuk Semua Pengguna</h2>
                            <p className="text-lg text-gray-600">Fitur yang disesuaikan untuk setiap peran</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {roles.map((role, index) => (
                                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">{role.title}</h3>
                                    <ul className="space-y-3">
                                        {role.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center text-gray-700">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-blue-600 to-green-500 text-white">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-4">🚀 Siap Memulai?</h2>
                        <p className="text-xl mb-8 opacity-90">
                            Bergabunglah dengan sekolah-sekolah yang sudah menggunakan sistem absensi digital
                        </p>
                        {!auth.user && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href={route('register')}
                                    className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center justify-center"
                                >
                                    Daftar Sekarang
                                    <CheckCircle className="w-5 h-5 ml-2" />
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="border-2 border-white text-white px-8 py-4 rounded-xl hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg"
                                >
                                    Sudah Punya Akun?
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                                        <UserCheck className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold">Sekolah Absenku</h3>
                                </div>
                                <p className="text-gray-400 mb-4">
                                    Sistem absensi digital yang dirancang khusus untuk lingkungan sekolah dengan antarmuka yang ramah pengguna.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Fitur</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center"><Calendar className="w-4 h-4 mr-2" /> Kalender Kehadiran</li>
                                    <li className="flex items-center"><FileText className="w-4 h-4 mr-2" /> Laporan PDF/Excel</li>
                                    <li className="flex items-center"><BarChart className="w-4 h-4 mr-2" /> Statistik Kehadiran</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-4">Bantuan</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li className="flex items-center"><Video className="w-4 h-4 mr-2" /> Video Tutorial</li>
                                    <li className="flex items-center"><Settings className="w-4 h-4 mr-2" /> Panduan Penggunaan</li>
                                    <li className="flex items-center"><Users className="w-4 h-4 mr-2" /> Dukungan Teknis</li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                            <p>&copy; 2024 Sekolah Absenku. Semua hak dilindungi.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}