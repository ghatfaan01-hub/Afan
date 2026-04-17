import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Landing() {
  const jurusan = [
    { name: 'TKJ', desc: 'Teknik Komputer & Jaringan' },
    { name: 'DKV', desc: 'Desain Komunikasi Visual' },
    { name: 'AK', desc: 'Akuntansi' },
    { name: 'BC', desc: 'Broadcasting' },
    { name: 'MPLB', desc: 'Manajemen Perkantoran & Layanan Bisnis' },
    { name: 'BD', desc: 'Bisnis Digital' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">SMK Prima Unggul</span>
            </div>
            <Link 
              to="/login" 
              className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/20"
            >
              Masuk ke Aplikasi
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Membangun Generasi <br />
              <span className="text-primary italic">Unggul & Berkarakter</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              SMK Prima Unggul berkomitmen untuk mencetak lulusan yang siap kerja, mandiri, dan memiliki daya saing tinggi di era digital.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login" className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl shadow-primary/30">
                Mulai Absensi Sekarang <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Siswa Aktif', value: '1200+', icon: Users },
            { label: 'Tenaga Pengajar', value: '80+', icon: GraduationCap },
            { label: 'Program Studi', value: '6', icon: BookOpen },
            { label: 'Tingkat Kelulusan', value: '99%', icon: CheckCircle },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Jurusan */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Program Keahlian</h2>
            <p className="text-gray-600">Pilihan jurusan yang relevan dengan kebutuhan industri masa kini.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jurusan.map((j, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white border border-gray-200 rounded-2xl hover:border-primary/30 hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="font-bold text-lg">{j.name}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{j.name}</h3>
                <p className="text-gray-600 leading-relaxed">{j.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">SMK Prima Unggul</span>
            </div>
            <p className="text-gray-400">
              Sekolah Menengah Kejuruan yang berfokus pada pengembangan skill praktis dan karakter siswa.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Kontak Kami</h4>
            <p className="text-gray-400 mb-2">Jl. Pendidikan No. 123, Kota Bekasi</p>
            <p className="text-gray-400 mb-2">info@smkprimaunggul.sch.id</p>
            <p className="text-gray-400">(021) 12345678</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">Tautan Cepat</h4>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/login" className="hover:text-primary transition-colors">Portal Absensi</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Profil Sekolah</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">PPDB Online</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2024 SMK Prima Unggul. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
