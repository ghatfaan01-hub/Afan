import { useState, useEffect } from 'react';
import { Profile, Student, StudentAttendance } from '../types';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Loader2,
  Save
} from 'lucide-react';

interface AttendanceStudentProps {
  profile: Profile | null;
}

export default function AttendanceStudent({ profile }: AttendanceStudentProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'hadir' | 'sakit' | 'izin' | 'alfa'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterClass, setFilterClass] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchStudents();
    fetchTodayAttendance();
  }, []);

  async function fetchStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTodayAttendance() {
    try {
      const { data, error } = await supabase
        .from('attendance_students')
        .select('*')
        .eq('date', today);

      if (error) throw error;
      
      const attendanceMap: Record<string, any> = {};
      data?.forEach(a => {
        attendanceMap[a.student_id] = a.status;
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching today attendance:', error);
    }
  }

  const handleStatusChange = (studentId: string, status: 'hadir' | 'sakit' | 'izin' | 'alfa') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    if (!profile) return;
    setSaving(true);
    setMessage(null);

    try {
      const attendanceData = Object.entries(attendance).map(([studentId, status]) => ({
        student_id: studentId,
        teacher_id: profile.id,
        date: today,
        status,
        timestamp: new Date().toISOString()
      }));

      if (attendanceData.length === 0) {
        throw new Error('Pilih minimal satu siswa untuk diabsen');
      }

      const { error } = await supabase
        .from('attendance_students')
        .upsert(attendanceData);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Berhasil menyimpan absensi siswa hari ini' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan absensi' });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesClass = filterClass ? s.class === filterClass : true;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.nis.includes(searchQuery);
    return matchesClass && matchesSearch;
  });

  const classes = Array.from(new Set(students.map(s => s.class))).sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Absensi Siswa</h1>
          <p className="text-gray-500">Input kehadiran siswa untuk tanggal {format(new Date(), 'd MMMM yyyy', { locale: id })}</p>
        </div>
        <button
          onClick={saveAttendance}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Simpan Absensi
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau NIS siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="">Semua Kelas</option>
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kelas</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.nis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {student.class}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {[
                        { id: 'hadir', label: 'H', color: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-500 hover:text-white', active: 'bg-green-500 text-white border-green-500' },
                        { id: 'izin', label: 'I', color: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-500 hover:text-white', active: 'bg-blue-500 text-white border-blue-500' },
                        { id: 'sakit', label: 'S', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-500 hover:text-white', active: 'bg-yellow-500 text-white border-yellow-500' },
                        { id: 'alfa', label: 'A', color: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-500 hover:text-white', active: 'bg-red-500 text-white border-red-500' },
                      ].map((btn) => (
                        <button
                          key={btn.id}
                          onClick={() => handleStatusChange(student.id, btn.id as any)}
                          className={`w-10 h-10 rounded-lg border font-bold transition-all ${
                            attendance[student.id] === btn.id ? btn.active : btn.color
                          }`}
                          title={btn.id.toUpperCase()}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">
                    Siswa tidak ditemukan.
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
