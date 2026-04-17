export type UserRole = 'admin' | 'guru' | 'tendik';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alfa';
  timestamp: string;
  profiles?: Profile;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  teacher_id: string;
  date: string;
  status: 'hadir' | 'sakit' | 'izin' | 'alfa';
  timestamp: string;
  students?: Student;
  profiles?: Profile;
}
