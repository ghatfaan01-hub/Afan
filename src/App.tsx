import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Profile } from './types';

// Pages (to be created)
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AttendanceEmployee from './pages/AttendanceEmployee';
import AttendanceStudent from './pages/AttendanceStudent';
import RecapEmployee from './pages/RecapEmployee';
import RecapStudent from './pages/RecapStudent';
import StudentData from './pages/StudentData';
import UserManagement from './pages/UserManagement';
import AppLayout from './components/AppLayout';

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={session ? <Navigate to="/app" /> : <Login />} />
        
        <Route path="/app" element={session ? <AppLayout profile={profile} /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard profile={profile} />} />
          <Route path="absensi-karyawan" element={<AttendanceEmployee profile={profile} />} />
          
          {/* Guru & Admin only */}
          {(profile?.role === 'admin' || profile?.role === 'guru') && (
            <>
              <Route path="absensi-siswa" element={<AttendanceStudent profile={profile} />} />
              <Route path="rekap/siswa" element={<RecapStudent profile={profile} />} />
            </>
          )}

          {/* Admin only */}
          {profile?.role === 'admin' && (
            <>
              <Route path="rekap/karyawan" element={<RecapEmployee />} />
              <Route path="data-siswa" element={<StudentData />} />
              <Route path="user-management" element={<UserManagement />} />
            </>
          )}
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
