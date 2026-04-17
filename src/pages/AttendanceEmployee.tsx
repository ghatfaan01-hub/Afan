import { useState, useEffect } from 'react';
import { Profile, EmployeeAttendance } from '../types';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Calendar as CalendarIcon
} from 'lucide-react';

interface AttendanceEmployeeProps {
  profile: Profile | null;
}

export default function AttendanceEmployee({ profile }: AttendanceEmployeeProps) {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<EmployeeAttendance[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<EmployeeAttendance | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (profile) {
      fetchAttendance();
    }
  }, [profile]);

  async function fetchAttendance() {
    try {
      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*')
        .eq('user_id', profile?.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
      
      const todayData = data?.find(a => a.date === today);
      setTodayAttendance(todayData || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  }

  const handleAttendance = async (status: 'hadir' | 'sakit' | 'izin') => {
    if (!profile) return;
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('attendance_employees')
        .upsert({
          user_id: profile.id,
          date: today,
          status,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: `Berhasil melakukan absensi: ${status}` });
      fetchAttendance();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal melakukan absensi' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Absensi Mandiri Karyawan</h1>
        <p className="text-gray-500 mt-2">Silakan lakukan absensi harian Anda di sini.</p>
      </div>

      {/* Today's Status Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-primary p-8 text-white text-center relative">
          <div className="relative z-10">
            <p className="text-white/80 font-medium mb-2 uppercase tracking-widest text-sm">Status Hari Ini</p>
            <h2 className="text-4xl font-black mb-4">
              {format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
            </h2>
            {todayAttendance ? (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full font-bold">
                <CheckCircle2 className="w-5 h-5" />
                Sudah Absen: <span className="capitalize">{todayAttendance.status}</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-6 py-2 rounded-full font-bold">
                <Clock className="w-5 h-5" />
                Belum Melakukan Absensi
              </div>
            )}
          </div>
          <CalendarIcon className="absolute -bottom-10 -left-10 w-48 h-48 text-white/10 -rotate-12" />
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleAttendance('hadir')}
              disabled={loading || !!todayAttendance}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900">Hadir</span>
            </button>

            <button
              onClick={() => handleAttendance('izin')}
              disabled={loading || !!todayAttendance}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900">Izin</span>
            </button>

            <button
              onClick={() => handleAttendance('sakit')}
              disabled={loading || !!todayAttendance}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-gray-100 hover:border-yellow-500 hover:bg-yellow-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-900">Sakit</span>
            </button>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Riwayat Absensi Terakhir</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {format(new Date(item.date), 'd MMMM yyyy', { locale: id })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                      item.status === 'hadir' ? 'bg-green-100 text-green-700' :
                      item.status === 'sakit' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'izin' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(item.timestamp), 'HH:mm:ss')}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">
                    Belum ada riwayat absensi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
