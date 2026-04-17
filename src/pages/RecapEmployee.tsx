import { useState, useEffect } from 'react';
import { Profile, EmployeeAttendance } from '../types';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Filter,
  UserCheck
} from 'lucide-react';

export default function RecapEmployee() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [attendance, setAttendance] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterRole, setFilterRole] = useState('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      const { data: attendanceData } = await supabase
        .from('attendance_employees')
        .select('*, profiles(*)')
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      setProfiles(profilesData || []);
      setAttendance(attendanceData || []);
    } catch (error) {
      console.error('Error fetching recap data:', error);
    } finally {
      setLoading(false);
    }
  }

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const filteredProfiles = profiles.filter(p => filterRole ? p.role === filterRole : true);

  const getStatus = (userId: string, date: Date) => {
    const record = attendance.find(a => a.user_id === userId && isSameDay(new Date(a.date), date));
    return record?.status;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'hadir': return 'text-green-600 font-bold';
      case 'sakit': return 'text-yellow-600 font-bold';
      case 'izin': return 'text-blue-600 font-bold';
      case 'alfa': return 'text-red-600 font-bold';
      default: return 'text-gray-300';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'hadir': return 'H';
      case 'sakit': return 'S';
      case 'izin': return 'I';
      case 'alfa': return 'A';
      default: return '-';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rekap Absensi Karyawan</h1>
          <p className="text-gray-500">Laporan kehadiran guru dan staf bulanan</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <Download className="w-5 h-5" />
          Ekspor Laporan
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900 min-w-[180px] justify-center">
            <CalendarIcon className="w-5 h-5 text-primary" />
            {format(currentDate, 'MMMM yyyy', { locale: id })}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="flex-1 md:w-48 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="guru">Guru</option>
            <option value="tendik">Tendik</option>
          </select>
        </div>
      </div>

      {/* Recap Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky left-0 z-10 bg-gray-50 px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200 min-w-[200px]">Karyawan</th>
                {daysInMonth.map(day => (
                  <th key={day.toString()} className="px-2 py-4 text-xs font-bold text-gray-500 text-center min-w-[35px] border-r border-gray-100">
                    {format(day, 'd')}
                  </th>
                ))}
                <th className="px-4 py-4 text-xs font-bold text-gray-500 text-center bg-green-50">H</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 text-center bg-blue-50">I</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 text-center bg-yellow-50">S</th>
                <th className="px-4 py-4 text-xs font-bold text-gray-500 text-center bg-red-50">A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={daysInMonth.length + 5} className="px-6 py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredProfiles.map((p) => {
                let h = 0, i = 0, s = 0, a = 0;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white px-6 py-4 border-r border-gray-200">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.full_name}</p>
                      <p className="text-[10px] text-gray-500 uppercase">{p.role}</p>
                    </td>
                    {daysInMonth.map(day => {
                      const status = getStatus(p.id, day);
                      if (status === 'hadir') h++;
                      if (status === 'izin') i++;
                      if (status === 'sakit') s++;
                      if (status === 'alfa') a++;
                      return (
                        <td key={day.toString()} className={`px-2 py-4 text-xs text-center border-r border-gray-100 ${getStatusColor(status)}`}>
                          {getStatusLabel(status)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-4 text-sm font-bold text-center text-green-600 bg-green-50/30">{h}</td>
                    <td className="px-4 py-4 text-sm font-bold text-center text-blue-600 bg-blue-50/30">{i}</td>
                    <td className="px-4 py-4 text-sm font-bold text-center text-yellow-600 bg-yellow-50/30">{s}</td>
                    <td className="px-4 py-4 text-sm font-bold text-center text-red-600 bg-red-50/30">{a}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
