import { Profile } from '../types';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DashboardProps {
  profile: Profile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const today = new Date();

  const stats = [
    { label: 'Total Siswa', value: '1,240', icon: GraduationCap, color: 'bg-blue-500', trend: '+12%' },
    { label: 'Hadir Hari Ini', value: '1,180', icon: UserCheck, color: 'bg-green-500', trend: '+5%' },
    { label: 'Izin/Sakit', value: '45', icon: Clock, color: 'bg-yellow-500', trend: '-2%' },
    { label: 'Tanpa Keterangan', value: '15', icon: Users, color: 'bg-red-500', trend: '-8%' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Halo, {profile?.full_name}! 👋</h1>
          <p className="text-gray-500 mt-1">Selamat datang di sistem absensi SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-medium text-gray-700">
            {format(today, 'EEEE, d MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.color} p-3 rounded-xl text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend}
                <TrendingUp className={`w-4 h-4 ${stat.trend.startsWith('+') ? '' : 'rotate-180'}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h2>
            <button className="text-primary text-sm font-bold hover:underline flex items-center gap-1">
              Lihat Semua <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Siswa A telah diabsen</p>
                  <p className="text-xs text-gray-500">Oleh Guru B • 10 menit yang lalu</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  Hadir
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-6">
          <div className="bg-primary rounded-2xl p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Butuh Bantuan?</h3>
              <p className="text-white/80 text-sm mb-4">Jika Anda mengalami kendala dalam penggunaan aplikasi, silakan hubungi tim IT.</p>
              <button className="bg-white text-primary px-4 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-colors">
                Hubungi Support
              </button>
            </div>
            <GraduationCap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Sekolah</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <p className="text-sm text-gray-600">Ujian Tengah Semester: 20 Mei 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <p className="text-sm text-gray-600">Libur Nasional: 1 Juni 2024</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <p className="text-sm text-gray-600">Rapat Guru: Setiap Sabtu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
